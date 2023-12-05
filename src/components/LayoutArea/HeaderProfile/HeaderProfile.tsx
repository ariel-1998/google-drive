import React, { ReactNode, useRef, useState, useEffect } from "react";
import styles from "./style.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { FaAngleDown, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useFiles } from "../../../context/FilesProvider";

const HeaderProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleOutsideClick = (e: globalThis.MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onClick={() => {
        setMenuOpen((pre) => !pre);
      }}
    >
      <i className={styles.icon}>
        <FaAngleDown />
      </i>
      {/**need to add defaulte image if no src */}
      <img className={styles.image} src={user?.photoURL || ""} />
      <div
        ref={listRef}
        onClick={(e) => e.stopPropagation()}
        className={`${styles.list} ${menuOpen && styles.active}`}
      >
        <ListItem className={styles.listHeader}>Settings</ListItem>
        <hr className={styles.divider} id="divider" />
        <Link to="/update/email" onClick={closeMenu}>
          <ListItem>Update Email</ListItem>
        </Link>
        <Link to="/update/password" onClick={closeMenu}>
          <ListItem>Update Password</ListItem>
        </Link>
        <Link to="/update/profile" onClick={closeMenu}>
          <ListItem>Update Profile</ListItem>
        </Link>
        <ToggleShowUploads closeMenu={closeMenu} />

        <Link
          className={styles.deleteAccount}
          to="/delete-account"
          onClick={closeMenu}
        >
          <ListItem>Delete Account</ListItem>
        </Link>
        <Link to="/logout" onClick={closeMenu}>
          <ListItem className={`${styles.logout} ${styles.logoutBtn}`}>
            Logout <FaSignOutAlt />
          </ListItem>
        </Link>
      </div>
    </div>
  );
};

export default HeaderProfile;

type ListItemProps = {
  children?: ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

function ListItem({ children, className, ...rest }: ListItemProps) {
  return (
    <div className={`${styles.listItem} ${className}`} {...rest}>
      {children}
    </div>
  );
}

type ToggleShowUploadsProps = {
  closeMenu(): void;
};
function ToggleShowUploads({ closeMenu }: ToggleShowUploadsProps) {
  const { showUploads, toggleShowUploads } = useFiles();
  const onToggle = () => {
    toggleShowUploads();
    closeMenu();
  };
  const { pathname } = useLocation();
  const showUploadsItem = pathname === "/" || pathname.startsWith("/folder");

  return (
    showUploadsItem && (
      <ListItem onClick={onToggle}>
        {showUploads ? "Hide" : "Show"} Uploads
      </ListItem>
    )
  );
}
