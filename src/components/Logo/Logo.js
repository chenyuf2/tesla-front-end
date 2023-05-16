import logo from "static/images/logo/logo.svg";

import styles from "./Logo.module.scss";
import clsx from "clsx";
const Logo = () => {
  return (
    <section
      className={clsx(
        styles["logo-container"],
        "d-flex justify-content-center"
      )}
    >
      <img src={logo} alt="logo" />
    </section>
  );
};

export default Logo;
