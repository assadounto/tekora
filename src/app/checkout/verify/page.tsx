import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { verifyCheckout } from "@/modules/payments/service";

export const dynamic = "force-dynamic";

export default async function CheckoutVerifyPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { reference } = await searchParams;
  if (!reference) return <main className="authShell"><section className="authCard"><h1>Payment reference missing.</h1><Link href="/dashboard">Return to dashboard</Link></section></main>;

  let result: Awaited<ReturnType<typeof verifyCheckout>>;
  try {
    result = await verifyCheckout(session.user.id, reference);
  } catch {
    return <main className="authShell"><section className="authCard"><p className="eyebrow">PAYMENT VERIFICATION</p><h1>Verification could not be completed.</h1><p className="muted">Please return to the dashboard. Access is only granted after Paystack confirms a successful payment.</p><Link className="primaryButton" href="/dashboard">Return to dashboard</Link></section></main>;
  }

  if (result.ok) redirect(result.redirect);

  return <main className="authShell"><section className="authCard"><p className="eyebrow">PAYMENT NOT CONFIRMED</p><h1>We could not unlock this item.</h1><p className="muted">No access has been granted. You can return to your dashboard and try again.</p><Link className="primaryButton" href="/dashboard">Return to dashboard</Link></section></main>;
}
