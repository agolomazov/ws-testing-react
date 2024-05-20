import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@radix-ui/themes';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      color='gray'
      variant='soft'
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } }).catch(
          () => {}
        )
      }
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
