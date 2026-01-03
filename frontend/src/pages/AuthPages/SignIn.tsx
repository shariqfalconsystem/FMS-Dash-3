import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard"
        description="This is React.js SignIn"
      />
        <SignInForm />
    </>
  );
}
