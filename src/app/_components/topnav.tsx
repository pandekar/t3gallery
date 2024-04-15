import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const TopNav = () => {
  return (
    <nav className="flex w-full items-center justify-between p-4 tex-xl font-semibold border-b">
      <div>Gallery</div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default TopNav;
