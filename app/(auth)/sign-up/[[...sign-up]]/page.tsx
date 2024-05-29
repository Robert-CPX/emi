import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <SignUp forceRedirectUrl="/welcome" />
  )
}

export default Page