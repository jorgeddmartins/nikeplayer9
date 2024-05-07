import cx from 'classnames';
import s from './Button.module.scss';

export enum ButtonTypes {
  WHITE = 'white',
  WHITE_BORDER = 'white_border',
  BLACK = 'black',
  VOLT = 'volt'
}

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: ButtonTypes;
  className?: string;
};

const Button = ({
  children,
  onClick,
  type = ButtonTypes.WHITE,
  className,
  ...props
}: ButtonProps) => {
  const buttonStyles = cx(
    {
      [s.button]: true,
      [s.black]: type === ButtonTypes.BLACK,
      [s.whiteBorder]: type === ButtonTypes.WHITE_BORDER,
      [s.volt]: type === ButtonTypes.VOLT
    },
    className
  );
  return (
    <button className={buttonStyles} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
