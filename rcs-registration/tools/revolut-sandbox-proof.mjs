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
  "dry-run": "dryRun"
};

const VALUE_FLAGS = {
  "order-id": "orderId",
  "amount": "amount",
  "currency": "currency",
  "description": "description",
  "customer-email": "customerEmail",
  "customer-name": "customerName",
  "reference": "reference",
  "redirect-url": "redirectUrl"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/revolut-sandbox-proof.mjs --dry-run",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --create-registration-order",
    "  REVOLUT_MERCHANT_API_SECRET=... node rcs-registration/tools/revolut-sandbox-proof.mjs --order-id <order_id>",
    "",
    "Options:",
    "  --create-registration-order    Create a GBP 120.00 sandbox Hosted Checkout order",
    "  --order-id <id>                 Retrieve an existing sandbox order",
    "  --amount 12000                 Amount in minor units; defaults to 12000",
    "  --currency GBP",
    "  --customer-email test@example.com",
    "  --customer-name \"Test User\"",
    "  --reference ROQ-RCS-...",
    "  --redirect-url https://...",
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
    payload.amount = Number(options.amount);
    payload.line_items[0].unit_price_amount = Number(options.amount);
    payload.line_items[0].total_amount = Number(options.amount);
  }
  if (options.currency) payload.currency = options.currency;
  if (options.description) {
    payload.description = options.description;
    payload.line_items[0].description = options.description;
  }
  if (options.customerEmail) payload.customer.email = options.customerEmail;
  if (options.customerName) payload.customer.full_name = options.customerName;
  if (options.reference) payload.merchant_order_data.reference = options.reference;
  if (options.redirectUrl) payload.redirect_url = options.redirectUrl;
  return payload;
}

function buildHeaders(secret) {
  return {
    "Authorization": `Bearer ${secret}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Revolut-Api-Version": process.env.REVOLUT_API_VERSION || DEFAULT_API_VERSION,
    "Idempotency-Key": `roq-rcs-${timestamp()}-${Math.random().toString(36).slice(2, 10)}`
  };
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
      ...buildHeaders(secret),
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
    checkoutUrlPresent: Boolean(order.checkout_url),
    checkoutUrl: order.checkout_url || "",
    customerId: order.customer && order.customer.id || "",
    payments: Array.isArray(order.payments)
      ? order.payments.map(payment => ({
          id: payment.id || "",
          state: payment.state || "",
          paymentMethodType: payment.payment_method && payment.payment_method.type || "",
          paymentMethodIdPresent: Boolean(payment.payment_method && payment.payment_method.id)
        }))
      : []
  };
}

function timestamp() {
  return new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const orderPayload = buildOrderPayload(options);

  if (options.dryRun || (!options.createRegistrationOrder && !options.orderId)) {
    console.log(JSON.stringify({
      mode: "dry_run",
      apiBaseUrl: getBaseUrl(),
      apiVersion: process.env.REVOLUT_API_VERSION || DEFAULT_API_VERSION,
      createOrder: {
        method: "POST",
        path: "/orders",
        payload: orderPayload
      },
      retrieveOrderExample: {
        method: "GET",
        path: "/orders/<order_id>"
      },
      secretPresent: Boolean(process.env.REVOLUT_MERCHANT_API_SECRET)
    }, null, 2));
    return;
  }

  if (options.createRegistrationOrder) {
    const order = await requestJson("/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload)
    });
    console.log(JSON.stringify({
      ok: true,
      action: "create_registration_order",
      order: summariseOrder(order)
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
