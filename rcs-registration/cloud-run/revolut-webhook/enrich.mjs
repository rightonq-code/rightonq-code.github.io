import { pathToFileURL } from "node:url";

const DEFAULT_API_BASE_URL = "https://sandbox-merchant.revolut.com/api";
const DEFAULT_API_VERSION = "2026-04-20";
const SAMPLE_SECRET = "sk_test_DO_NOT_USE_IN_PRODUCTION";

function normaliseBaseUrl(value = DEFAULT_API_BASE_URL) {
  return String(value || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

function buildMerchantHeaders({
  merchantApiSecret,
  apiVersion = DEFAULT_API_VERSION
}) {
  if (!merchantApiSecret) throw new Error("Missing Revolut Merchant API secret");
  return {
    Authorization: `Bearer ${merchantApiSecret}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    "Revolut-Api-Version": apiVersion
  };
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Revolut order retrieval returned non-JSON response (${response.status})`);
  }
}

function buildSafeRevolutError(response, data) {
  const code = data && typeof data === "object" && data.code ? String(data.code) : "unknown";
  const message = data && typeof data === "object" && data.message ? String(data.message) : "Revolut request failed";
  return new Error(`Revolut order retrieval failed (${response.status}): ${code} - ${message}`);
}

async function retrieveRevolutOrder(orderId, {
  fetchImpl = globalThis.fetch,
  merchantApiSecret,
  apiBaseUrl = DEFAULT_API_BASE_URL,
  apiVersion = DEFAULT_API_VERSION
} = {}) {
  if (!orderId) throw new Error("Missing Revolut order ID");
  if (typeof fetchImpl !== "function") throw new Error("Missing fetch implementation");

  const response = await fetchImpl(`${normaliseBaseUrl(apiBaseUrl)}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: buildMerchantHeaders({ merchantApiSecret, apiVersion })
  });
  const data = await parseJsonResponse(response);
  if (!response.ok) throw buildSafeRevolutError(response, data);
  return data;
}

function normaliseOrderType(order) {
  return String(order && order.type || "").trim().toLowerCase();
}

function summarisePayment(payment = {}) {
  return {
    id: payment.id || "",
    orderId: payment.order_id || payment.orderId || "",
    state: payment.state || "",
    amount: payment.amount || "",
    currency: payment.currency || "",
    declineReason: payment.decline_reason || payment.declineReason || "",
    paymentMethodType: payment.payment_method && payment.payment_method.type || payment.paymentMethodType || "",
    paymentMethodIdPresent: Boolean(payment.payment_method && payment.payment_method.id || payment.paymentMethodIdPresent),
    authenticationChallengePresent: Boolean(payment.authentication_challenge || payment.authenticationChallengePresent)
  };
}

function summariseOrder(order = {}) {
  return {
    id: order.id || "",
    tokenPresent: Boolean(order.token),
    type: order.type || "",
    normalisedType: normaliseOrderType(order),
    state: order.state || "",
    amount: order.amount || "",
    refundedAmount: order.refunded_amount || order.refundedAmount || "",
    currency: order.currency || "",
    reference: order.merchant_order_data && order.merchant_order_data.reference || order.reference || "",
    externalReference: order.merchant_order_ext_ref || order.externalReference || "",
    relatedOrderId: order.related_order_id || order.relatedOrderId || "",
    originalOrderId: order.original_order_id || order.originalOrderId || "",
    checkoutUrlPresent: Boolean(order.checkout_url || order.checkoutUrlPresent),
    customerId: order.customer && order.customer.id || order.customerId || "",
    payments: Array.isArray(order.payments) ? order.payments.map(summarisePayment) : []
  };
}

function resolveLedgerLookupOrderId(order = {}) {
  const summary = summariseOrder(order);
  if (summary.normalisedType === "refund") {
    return summary.relatedOrderId || summary.originalOrderId || "";
  }
  return summary.id;
}

function buildEnrichmentContext(order = {}) {
  const summary = summariseOrder(order);
  const ledgerLookupOrderId = resolveLedgerLookupOrderId(order);
  const isRefund = summary.normalisedType === "refund";

  return {
    ok: true,
    order: summary,
    classification: isRefund ? "refund_order" : "payment_order",
    ledgerLookupOrderId,
    applicationReference: summary.externalReference || summary.reference || "",
    requiresPaymentOrderLookup: isRefund || !summary.externalReference && !summary.reference,
    warnings: isRefund && !ledgerLookupOrderId
      ? ["refund_order_missing_related_order_id"]
      : []
  };
}

async function enrichRevolutOrder(orderId, options = {}) {
  const order = await retrieveRevolutOrder(orderId, options);
  return buildEnrichmentContext(order);
}

async function runSelfTest() {
  const calls = [];
  const samplePaymentOrder = {
    id: "order_payment_TEST",
    token: "token_not_returned",
    type: "payment",
    state: "completed",
    amount: 12000,
    currency: "GBP",
    merchant_order_data: {
      reference: "ROQ-RCS-TEST-ENRICHMENT"
    },
    merchant_order_ext_ref: "ROQ-RCS-TEST-ENRICHMENT",
    payments: [
      {
        id: "payment_TEST",
        state: "captured",
        amount: 12000,
        currency: "GBP",
        payment_method: {
          type: "card",
          id: "pm_should_not_be_returned"
        }
      }
    ]
  };
  const sampleRefundOrder = {
    id: "refund_order_TEST",
    type: "REFUND",
    state: "PROCESSING",
    related_order_id: "order_payment_TEST",
    payments: [
      {
        id: "refund_payment_TEST",
        state: "COMPLETED"
      }
    ]
  };
  const fetchImpl = async (url, options) => {
    calls.push({
      url,
      method: options.method,
      authorizationPresent: Boolean(options.headers.Authorization),
      apiVersion: options.headers["Revolut-Api-Version"]
    });
    const order = url.endsWith("/orders/refund_order_TEST") ? sampleRefundOrder : samplePaymentOrder;
    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify(order);
      }
    };
  };

  const payment = await enrichRevolutOrder("order_payment_TEST", {
    fetchImpl,
    merchantApiSecret: SAMPLE_SECRET,
    apiBaseUrl: "https://sandbox-merchant.revolut.com/api/",
    apiVersion: DEFAULT_API_VERSION
  });
  const refund = await enrichRevolutOrder("refund_order_TEST", {
    fetchImpl,
    merchantApiSecret: SAMPLE_SECRET
  });
  const missingRelated = buildEnrichmentContext({
    id: "refund_without_related_TEST",
    type: "REFUND"
  });

  const passed = payment.classification === "payment_order"
    && payment.ledgerLookupOrderId === "order_payment_TEST"
    && payment.applicationReference === "ROQ-RCS-TEST-ENRICHMENT"
    && payment.order.tokenPresent === true
    && payment.order.payments[0].paymentMethodIdPresent === true
    && !Object.prototype.hasOwnProperty.call(payment.order, "token")
    && refund.classification === "refund_order"
    && refund.ledgerLookupOrderId === "order_payment_TEST"
    && refund.requiresPaymentOrderLookup === true
    && missingRelated.warnings.includes("refund_order_missing_related_order_id")
    && calls.length === 2
    && calls.every((call) => call.authorizationPresent === true)
    && !JSON.stringify({ payment, refund, missingRelated, calls }).includes(SAMPLE_SECRET);

  return {
    ok: passed,
    mode: "self_test",
    cases: {
      payment,
      refund,
      missingRelated,
      calls
    },
    note: "Self-test uses fake orders and an injected fake fetch only. It does not call Revolut, Firestore, Apps Script, or Google Sheets."
  };
}

export {
  DEFAULT_API_BASE_URL,
  DEFAULT_API_VERSION,
  buildEnrichmentContext,
  buildMerchantHeaders,
  enrichRevolutOrder,
  normaliseOrderType,
  resolveLedgerLookupOrderId,
  retrieveRevolutOrder,
  runSelfTest,
  summariseOrder,
  summarisePayment
};

async function main() {
  if (process.argv.includes("--self-test")) {
    const result = await runSelfTest();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  console.log("Usage: node rcs-registration/cloud-run/revolut-webhook/enrich.mjs --self-test");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
