interface AlertProps {
  isHidden: boolean;
  text: string;
}

const Alert = (props: AlertProps) => {
  return (
    <div className={props.isHidden ? "hidden" : ""}>
      <div className="bg-rose-600 text-white rounded-md py-4">
        <p>{props.text}</p>
      </div>
    </div>
  );
};

export default Alert;
