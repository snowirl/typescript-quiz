import { Link, Button } from "@nextui-org/react";

const NavigationMenu = () => {
  return (
    <div className="flex bg-gray-100 justify-between px-4 py-4 m-auto">
      <div className="space-x-2">
        <Button variant="light">Home</Button>
        <Button variant="light">Sets</Button>
        <Button color="primary">Create</Button>
      </div>
      <div></div>
      <div className="space-x-2">
        <Button color="primary" variant="light" className="px-6">
          Log in
        </Button>
        <Button color="primary" className="px-6">
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default NavigationMenu;
