interface AlertProps {
  isHidden: boolean;
  text: string;
}

const Alert = (props: AlertProps) => {
  return (
    <div className={props.isHidden ? "hidden" : "relative"}>
      <div className="bg-rose-700 text-white font-semibold rounded-md py-4 relative">
        <p>{props.text}</p>
        {/* <div className="absolute bottom-2 right-4">
          <Button className="" isIconOnly variant="solid" color="danger">
            X
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Alert;
