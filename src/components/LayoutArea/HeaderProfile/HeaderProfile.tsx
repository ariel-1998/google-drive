import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";
import styles from "./style.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logout from "../../AuthArea/Logout/Logout";

const HeaderProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!listRef.current || !menuOpen) return;

    // needed because of the visibility hidden css for the animation
    setTimeout(() => {
      listRef.current?.focus();
    }, 20);
  }, [menuOpen]);

  return (
    <div
      className={styles.container}
      onClick={() => setMenuOpen((pre) => !pre)}
    >
      <i>
        <FaAngleDown />
      </i>
      {/**need to add defaulte image if no src */}
      <img className={styles.image} src={user?.photoURL || ""} />
      <div
        ref={listRef}
        onClick={(e) => e.stopPropagation()}
        onBlur={closeMenu}
        tabIndex={0}
        className={`${styles.list} ${menuOpen && styles.active}`}
      >
        <ListItem className={styles.listHeader}>Settings</ListItem>
        <hr className={styles.divider} />

        <Link to="/update/email" onClick={closeMenu}>
          <ListItem>Update Email</ListItem>
        </Link>
        <Link to="/update/password" onClick={closeMenu}>
          <ListItem>Update Password</ListItem>
        </Link>
        <Link to="/update/profile" onClick={closeMenu}>
          <ListItem>Update Profile</ListItem>
        </Link>

        <ListItem className={styles.logout}>
          <Logout className={styles.logoutBtn} callback={closeMenu} />
        </ListItem>
      </div>
    </div>
  );
};

export default HeaderProfile;

type ListItemProps = {
  children?: ReactNode;
  className?: string;
};

function ListItem({ children, className }: ListItemProps) {
  return <div className={`${styles.listItem} ${className}`}>{children}</div>;
}
