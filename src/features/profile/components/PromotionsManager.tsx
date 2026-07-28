"use client";

import { useState } from "react";
import { Tag, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/shared/form-feedback";
import { usePromotions } from "../hooks/usePromotions";

export function PromotionsManager() {
  const { promotions, isLoading, createPromotion, isCreating, removePromotion } = usePromotions();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation the backend doesn't do (§10.2):
    if (!code.trim()) {
      toast.error("Enter a promo code.");
      return;
    }
    if (promotions.some((p) => p.code.toLowerCase() === code.trim().toLowerCase())) {
      toast.error("You already have a promotion with that code.");
      return;
    }
    const pct = discountPercentage ? Number(discountPercentage) : undefined;
    if (pct !== undefined && (Number.isNaN(pct) || pct < 0 || pct > 100)) {
      toast.error("Discount must be between 0 and 100.");
      return;
    }
    if (!validUntil) {
      toast.error("Pick an expiry date.");
      return;
    }
    if (new Date(validUntil).getTime() <= Date.now()) {
      toast.error("Expiry date must be in the future.");
      return;
    }

    try {
      await createPromotion({
        code: code.trim(),
        description: description.trim() || undefined,
        discountPercentage: pct,
        validUntil: new Date(validUntil).toISOString(),
        isActive,
      });
      setCode("");
      setDescription("");
      setDiscountPercentage("");
      setValidUntil("");
      setIsActive(true);
    } catch {
      // toast already shown
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleCreate} className="grid gap-4 rounded-[14px] border border-yegna-border bg-background p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="promo-code">Promo code</Label>
          <Input id="promo-code" placeholder="SAVE10" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="promo-discount">Discount %</Label>
          <Input
            id="promo-discount"
            type="number"
            min={0}
            max={100}
            placeholder="10"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="promo-description">Description</Label>
          <Input
            id="promo-description"
            placeholder="10% off your first order"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="promo-expiry">Valid until</Label>
          <Input
            id="promo-expiry"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <span className="text-sm text-muted-foreground">Active immediately</span>
        </div>
        <Button type="submit" disabled={isCreating} className="sm:col-span-2 w-fit">
          {isCreating ? <Spinner /> : <Plus className="size-4" />}
          Create promotion
        </Button>
      </form>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" /> Loading promotions...
        </div>
      ) : promotions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No promotions yet.</p>
      ) : (
        <ul className="space-y-2">
          {promotions.map((promo) => (
            <li
              key={promo.id}
              className="flex items-center justify-between rounded-[10px] border border-yegna-border bg-background px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-yegna-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {promo.code}
                    {typeof promo.discountPercentage === "number" && ` · ${promo.discountPercentage}% off`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {promo.description ? `${promo.description} · ` : ""}
                    Expires {new Date(promo.validUntil).toLocaleDateString()}
                    {!promo.isActive && " · Inactive"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePromotion(promo.id)}
                aria-label="Delete promotion"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}