function FormInput({ name, type, value, onChange, placeholder }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={styles.input}
      required
    />
  );
}

const styles = {
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
  },
};

export default FormInput;
