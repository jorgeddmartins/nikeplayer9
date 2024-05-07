import s from './Checkbox.module.scss';

type CheckboxProps = {
  onChange?: () => void;
  checked?: boolean;
  disabled?: boolean;
};

const Checkbox = ({ onChange, checked, disabled }: CheckboxProps) => {
  return (
    <label className={s.wrap} onClick={onChange}>
      <input type="checkbox" disabled={disabled} defaultChecked={checked} />
      <span className={s.checkMark}></span>
    </label>
  );
};

export default Checkbox;
