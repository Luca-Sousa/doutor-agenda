"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { createStripeCheckout } from "@/actions/stripe-checkout.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SubscriptionPlanProps {
  activePlan?: string;
  className?: string;
  userEmail?: string;
  plan: {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    highlight: boolean;
  };
}

export function SubscriptionPlan({
  activePlan,
  className,
  userEmail,
  plan,
}: SubscriptionPlanProps) {
  const router = useRouter();

  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );
      if (!stripe) throw new Error("Stripe not found");

      if (!data?.sessionId) throw new Error("Session ID not found");

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    },
  });

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute();
  };

  const handleManagerPlanCLick = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`,
    );
  };

  // Visual highlight for the recommended plan
  const highlightStyles = plan.highlight
    ? "border-2 border-primary shadow-xl scale-105"
    : "border";

  return (
    <Card
      className={`relative flex flex-col justify-between transition-all duration-200 hover:scale-[1.03] ${highlightStyles} ${className ?? ""}`}
      style={{
        background:
          plan.highlight
            ? "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)"
            : "white",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
            {plan.name}
            {plan.highlight && (
              <Star className="w-5 h-5 text-yellow-400" />
            )}
          </h3>
          {activePlan === plan.id && plan.id !== "free" && (
            <Badge className="bg-green-100 text-green-700 border border-green-300">
              Atual
            </Badge>
          )}
        </div>
        <p className="text-gray-600 mt-1">{plan.description}</p>
        <div className="flex items-end gap-1 mt-2">
          <span className="text-4xl font-extrabold text-primary">{plan.price}</span>
          <span className="text-base text-gray-500 mb-1">/ mês</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between flex-1">
        <div className="space-y-3 border-t border-gray-200 pt-4">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-500" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {plan.id === "premium" ? (
            <Button className="w-full" variant="outline" disabled>
              Em breve
            </Button>
          ) : plan.id !== "free" && (
            <Button
              className="w-full cursor-pointer"
              variant={activePlan === plan.id ? "outline" : plan.highlight ? "default" : "secondary"}
              onClick={
                activePlan === plan.id ? handleManagerPlanCLick : handleSubscribeClick
              }
              disabled={createStripeCheckoutAction.isExecuting}
            >
              {createStripeCheckoutAction.isExecuting ? (
                <Loader2 className="mr-1 size-4 animate-spin" />
              ) : activePlan === plan.id ? (
                "Gerenciar assinatura"
              ) : (
                "Fazer assinatura"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
