"use server";

import Stripe from "stripe";

import { actionClient } from "@/lib/safe-action";

import { requireSession } from "./clinic.actions";

export const createStripeCheckout = actionClient.action(async () => {
  const session = await requireSession();

  if (!process.env.STRIPE_SECRET_KEY)
    throw new Error("Stripe secret key not found");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });

  const { id: sessionId } = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    subscription_data: {
      metadata: {
        userId: session.user.id,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  return { sessionId };
});
