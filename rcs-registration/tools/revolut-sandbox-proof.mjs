#!/usr/bin/env node

const DEFAULT_API_BASE_URL = "https://sandbox-merchant.revolut.com/api";
const DEFAULT_API_VERSION = "2026-04-20";

const DEFAULT_ORDER = {
  amount: 12000,
  currency: "GBP",
  description: "RightOnQ RCS registration fee",
  redirect_url: "https://rightonq-code.github.io/rcs-registration/index.html?payment=success",
  customer: {
    email: "test-public-parta@example.com",
    full_name: "Test Public Submitter"
  },
  merchant_order_data: {
    reference: `ROQ-RCS-REVOLUT-PROOF-${timestamp()}`
  },
  line_items: [
    {
      name: "RightOnQ RCS registration fee",
      type: "service",
      quantity: {
        value: 1
      },
      unit_price_amount: 12000,
      total_amount: 12000,
      description: "RCS sender registration work. Includes GBP 100 + VAT."
    }
  ]
};

const BOOLEAN_FLAGS = {
  "create-registration-order": "createRegistrationOrder",
  "list-orders": "listOrders",
  "retrieve-payments": "retrievePayments",
  "refund-order": "refundOrder",
  "pay-order": "payOrder",
  "dry-run": "dryRun"
};

const VALUE_FLAGS = {
  "order-id": "orderId",
  "application-id": "applicationId",
  "amount": "amount",
  "currency": "currency",
  "description": "description",
  "customer-email": "customerEmail",
  "customer-name": "customerName",
  "customer-id": "customerId",
  "reference": "reference",
  "idempotency-key": "idempotencyKey",
  "redirect-url": "redirectUrl",
  "limit": "limit",
  "state": "state",
  "refund-amount": "refundAmount",
  "refund-currency": "refundCurrency",
  "refund-description": "refundDescription",
  "refund-reference": "refundReference",
  "payment-method-id": "paymentMethodId",
  "payment-method-type": "paymentMethodType",
  "payment-initiator": "paymentInitiator"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/revolut-sandbox-proof.mjs --dry-run",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --create-registration-order",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --create-registration-order --application-id ROQ-RCS-...",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --order-id <order_id>",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --list-orders --reference ROQ-RCS-...",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --retrieve-payments --order-id <order_id>",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --refund-order --order-id <order_id> --refund-amount 12000",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --pay-order --order-id <order_id> --payment-method-id <id> --payment-method-type card",
    "",
    "Options:",
    "  --create-registration-order    Create a GBP 120.00 sandbox Hosted Checkout order",
    "  --order-id <id>                 Retrieve an existing sandbox order",
    "  --application-id ROQ-RCS-...    Use the onboarding application ID as Revolut reference",
    "  --amount 12000                 Amount in minor units; defaults to 12000",
    "  --currency GBP",
    "  --customer-email test@example.com",
    "  --customer-name \"Test User\"",
    "  --customer-id <id>              Use an existing Revolut customer ID on order creation",
    "  --reference ROQ-RCS-...         Override the Revolut merchant_order_data.reference",
    "  --idempotency-key key           Use a repeatable key to prove duplicate protection",
    "  --redirect-url https://...",
    "  --list-orders                  Retrieve orders, optionally filtered by --reference and --state",
    "  --limit 100",
    "  --state completed",
    "  --retrieve-payments            Retrieve payments for --order-id",
    "  --refund-order                 Refund --order-id; use --refund-amount in minor units",
    "  --refund-amount 12000",
    "  --refund-reference ROQ-RCS-...",
    "  --refund-description \"Registration fee refund\"",
    "  --pay-order                    Pay --order-id using a saved payment method",
    "  --payment-method-id <id>",
    "  --payment-method-type card|revolut_pay",
    "  --payment-initiator merchant|customer",
    "  --dry-run                      Print request details without sending",
    "",
    "Environment:",
    "  REVOLUT_MERCHANT_API_SECRET     Required for live sandbox calls",
    "  REVOLUT_MERCHANT_API_BASE_URL   Defaults to https://sandbox-merchant.revolut.com/api",
    "  REVOLUT_API_VERSION             Defaults to 2026-04-20",
    "",
    "Safety:",
    "  Do not paste Revolut secrets into chat or commit them to the repo.",
    "  This tool stores no card data and prints no secret values."
  ].join("\n");
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }
    if (!token.startsWith("--")) throw new Error("Unexpected argument: " + token);

    const rawName = token.slice(2);
    if (Object.prototype.hasOwnProperty.call(BOOLEAN_FLAGS, rawName)) {
      options[BOOLEAN_FLAGS[rawName]] = true;
      continue;
    }

    const fieldName = VALUE_FLAGS[rawName];
    if (!fieldName) throw new Error("Unknown option: " + token);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error("Missing value for " + token);
    options[fieldName] = value;
    index += 1;
  }
  return options;
}

function buildOrderPayload(options) {
  const payload = JSON.parse(JSON.stringify(DEFAULT_ORDER));
  if (options.amount) {
    const amount = Number(options.amount);
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("--amount must be a positive integer in minor units");
    }
    payload.amount = amount;
    payload.line_items[0].unit_price_amount = amount;
    payload.line_items[0].total_amount = amount;
  }
  if (options.currency) payload.currency = options.currency;
  if (options.description) {
    payload.description = options.description;
    payload.line_items[0].description = options.description;
  }
  if (options.customerEmail) payload.customer.email = options.customerEmail;
  if (options.customerName) payload.customer.full_name = options.customerName;
  if (options.customerId) payload.customer = { id: options.customerId };
  if (options.applicationId) payload.merchant_order_data.reference = options.applicationId;
  if (options.reference) payload.merchant_order_data.reference = options.reference;
  if (options.redirectUrl) payload.redirect_url = options.redirectUrl;
  return payload;
}

function buildRefundPayload(options) {
  if (!options.refundAmount) throw new Error("--refund-amount is required for --refund-order");
  const amount = Number(options.refundAmount);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("--refund-amount must be a positive integer in minor units");
  }
  const payload = {
    amount,
    currency: options.refundCurrency || options.currency || DEFAULT_ORDER.currency,
    description: options.refundDescription || "RightOnQ RCS registration fee refund"
  };
  const reference = options.refundReference || options.reference || options.applicationId;
  if (reference) payload.merchant_order_ext_ref = reference;
  return payload;
}

function buildPayOrderPayload(options) {
  if (!options.paymentMethodId) throw new Error("--payment-method-id is required for --pay-order");
  return {
    saved_payment_method: {
      type: options.paymentMethodType || "card",
      id: options.paymentMethodId,
      initiator: options.paymentInitiator || "merchant"
    }
  };
}

function buildHeaders(secret, options = {}) {
  const headers = {
    "Authorization": `Bearer ${secret}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Revolut-Api-Version": process.env.REVOLUT_API_VERSION || DEFAULT_API_VERSION
  };
  if (options.includeIdempotency) {
    headers["Idempotency-Key"] = options.idempotencyKey || generateIdempotencyKey(options.reference);
  }
  return headers;
}

function getBaseUrl() {
  return (process.env.REVOLUT_MERCHANT_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

async function requestJson(path, options = {}) {
  const secret = process.env.REVOLUT_MERCHANT_API_SECRET;
  if (!secret) throw new Error("Set REVOLUT_MERCHANT_API_SECRET before running live sandbox calls");

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(secret, {
        includeIdempotency: options.method && options.method !== "GET",
        idempotencyKey: options.idempotencyKey,
        reference: options.reference
      }),
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Non-JSON response from Revolut (${response.status}): ${text.slice(0, 500)}`);
  }
  if (!response.ok) {
    throw new Error(`Revolut request failed (${response.status}): ${JSON.stringify(data, null, 2)}`);
  }
  return data;
}

function summariseOrder(order) {
  return {
    id: order.id || "",
    token: order.token || "",
    state: order.state || "",
    amount: order.amount || "",
    currency: order.currency || "",
    reference: order.merchant_order_data && order.merchant_order_data.reference || "",
    externalReference: order.merchant_order_ext_ref || "",
    checkoutUrlPresent: Boolean(order.checkout_url),
    checkoutUrl: order.checkout_url || "",
    customerId: order.customer && order.customer.id || "",
    payments: Array.isArray(order.payments)
      ? order.payments.map(summarisePayment)
      : []
  };
}

function summarisePayment(payment) {
  return {
    id: payment.id || "",
    orderId: payment.order_id || "",
    state: payment.state || "",
    amount: payment.amount || "",
    currency: payment.currency || "",
    declineReason: payment.decline_reason || "",
    paymentMethodType: payment.payment_method && payment.payment_method.type || "",
    paymentMethodIdPresent: Boolean(payment.payment_method && payment.payment_method.id),
    authenticationChallengePresent: Boolean(payment.authentication_challenge)
  };
}

function timestamp() {
  return new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
}

function generateIdempotencyKey(reference) {
  const safeReference = (reference || "roq-rcs-proof").replace(/[^A-Za-z0-9_.:-]/g, "-").slice(0, 80);
  return `${safeReference}-${timestamp()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const orderPayload = buildOrderPayload(options);
  const refundPayload = options.refundOrder ? buildRefundPayload(options) : null;
  const payOrderPayload = options.payOrder ? buildPayOrderPayload(options) : null;
  const idempotencyKey = options.idempotencyKey || generateIdempotencyKey(orderPayload.merchant_order_data.reference);

  if (options.dryRun || (!options.createRegistrationOrder && !options.orderId && !options.listOrders)) {
    console.log(JSON.stringify({
      mode: "dry_run",
      apiBaseUrl: getBaseUrl(),
      apiVersion: process.env.REVOLUT_API_VERSION || DEFAULT_API_VERSION,
      idempotencyKey: {
        supplied: Boolean(options.idempotencyKey),
        value: idempotencyKey,
        note: "Use the same key twice in sandbox to prove duplicate order protection."
      },
      createOrder: {
        method: "POST",
        path: "/orders",
        headers: {
          Authorization: process.env.REVOLUT_MERCHANT_API_SECRET ? "Bearer [present]" : "Bearer [missing]",
          "Content-Type": "application/json",
          Accept: "application/json",
          "Revolut-Api-Version": process.env.REVOLUT_API_VERSION || DEFAULT_API_VERSION,
          "Idempotency-Key": idempotencyKey
        },
        payload: orderPayload
      },
      retrieveOrderExample: {
        method: "GET",
        path: "/orders/<order_id>"
      },
      listOrdersExample: {
        method: "GET",
        path: "/orders?merchant_order_data_reference=<application_id>&limit=100"
      },
      retrievePaymentsExample: {
        method: "GET",
        path: "/orders/<order_id>/payments"
      },
      refundOrder: refundPayload ? {
        method: "POST",
        path: "/1.0/orders/<order_id>/refund",
        headers: {
          Authorization: process.env.REVOLUT_MERCHANT_API_SECRET ? "Bearer [present]" : "Bearer [missing]",
          "Content-Type": "application/json",
          Accept: "application/json",
          "Revolut-Api-Version": process.env.REVOLUT_API_VERSION || DEFAULT_API_VERSION,
          "Idempotency-Key": idempotencyKey
        },
        payload: refundPayload
      } : null,
      payOrder: payOrderPayload ? {
        method: "POST",
        path: "/orders/<order_id>/payments",
        headers: {
          Authorization: process.env.REVOLUT_MERCHANT_API_SECRET ? "Bearer [present]" : "Bearer [missing]",
          "Content-Type": "application/json",
          Accept: "application/json",
          "Revolut-Api-Version": process.env.REVOLUT_API_VERSION || DEFAULT_API_VERSION,
          "Idempotency-Key": idempotencyKey
        },
        payload: payOrderPayload
      } : null,
      secretPresent: Boolean(process.env.REVOLUT_MERCHANT_API_SECRET)
    }, null, 2));
    return;
  }

  if (options.createRegistrationOrder) {
    const order = await requestJson("/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
      idempotencyKey,
      reference: orderPayload.merchant_order_data.reference
    });
    console.log(JSON.stringify({
      ok: true,
      action: "create_registration_order",
      requestReference: orderPayload.merchant_order_data.reference,
      idempotencyKey,
      order: summariseOrder(order)
    }, null, 2));
    return;
  }

  if (options.listOrders) {
    const params = new URLSearchParams();
    if (options.limit) params.set("limit", options.limit);
    if (options.state) params.append("state", options.state);
    const reference = options.reference || options.applicationId;
    if (reference) params.set("merchant_order_data_reference", reference);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    const result = await requestJson(`/orders${suffix}`, { method: "GET" });
    const orders = Array.isArray(result.orders) ? result.orders : [];
    console.log(JSON.stringify({
      ok: true,
      action: "list_orders",
      count: orders.length,
      orders: orders.map(summariseOrder)
    }, null, 2));
    return;
  }

  if (options.refundOrder) {
    if (!options.orderId) throw new Error("--order-id is required for --refund-order");
    const refund = await requestJson(`/1.0/orders/${encodeURIComponent(options.orderId)}/refund`, {
      method: "POST",
      body: JSON.stringify(refundPayload),
      idempotencyKey,
      reference: refundPayload.merchant_order_ext_ref || orderPayload.merchant_order_data.reference
    });
    console.log(JSON.stringify({
      ok: true,
      action: "refund_order",
      idempotencyKey,
      refund: summariseOrder(refund)
    }, null, 2));
    return;
  }

  if (options.payOrder) {
    if (!options.orderId) throw new Error("--order-id is required for --pay-order");
    const payment = await requestJson(`/orders/${encodeURIComponent(options.orderId)}/payments`, {
      method: "POST",
      body: JSON.stringify(payOrderPayload),
      idempotencyKey,
      reference: orderPayload.merchant_order_data.reference
    });
    console.log(JSON.stringify({
      ok: true,
      action: "pay_order",
      idempotencyKey,
      payment: summarisePayment(payment)
    }, null, 2));
    return;
  }

  if (options.retrievePayments) {
    if (!options.orderId) throw new Error("--order-id is required for --retrieve-payments");
    const result = await requestJson(`/orders/${encodeURIComponent(options.orderId)}/payments`, {
      method: "GET"
    });
    const payments = Array.isArray(result)
      ? result
      : Array.isArray(result.payments) ? result.payments : [];
    console.log(JSON.stringify({
      ok: true,
      action: "retrieve_payments",
      count: payments.length,
      payments: payments.map(summarisePayment)
    }, null, 2));
    return;
  }

  if (options.orderId) {
    const order = await requestJson(`/orders/${encodeURIComponent(options.orderId)}`, {
      method: "GET"
    });
    console.log(JSON.stringify({
      ok: true,
      action: "retrieve_order",
      order: summariseOrder(order)
    }, null, 2));
  }
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
