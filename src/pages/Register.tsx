
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-banking-primary">Banking Horizon</h1>
        <p className="text-muted-foreground">Join thousands of customers using Banking Horizon</p>
      </div>
      <RegisterForm />
    </div>
  );
}
