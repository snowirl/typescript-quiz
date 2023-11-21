import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  Tab,
} from "@nextui-org/react";

const Legal = () => {
  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen w-full pt-6">
      <div className="flex justify-center items-center space-y-5 mx-4">
        <Card className="flex-grow max-w-[1000px]">
          <CardHeader className="flex justify-center py-6">
            <Tabs
              aria-label="Options"
              size="lg"
              variant="underlined"
              color="primary"
              className="font-semibold"
            >
              <Tab key="terms" title="Terms of Service" />
              <Tab key="privacy" title="Privacy Policy" />
              <Tab key="cookie" title="Cookie Policy" />
              <Tab key="copyright" title="Copyright Infringement" />
            </Tabs>
          </CardHeader>
          <CardBody></CardBody>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Legal;
