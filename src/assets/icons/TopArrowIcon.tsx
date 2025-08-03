const TopArrowIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => {
  return (
    <svg
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.33447 6L5.33447 2L9.33447 6"
        stroke={stroke || "#4661E6"}
        strokeWidth="2"
      />
    </svg>
  );
};

export default TopArrowIcon;
