import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <SignUp fallbackRedirectUrl="/welcome" />
  )
}

export default Page