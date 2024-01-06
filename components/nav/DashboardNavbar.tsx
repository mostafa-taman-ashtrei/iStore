import ThemeTogglerButton from "./ThemeTogglerButton";
import UserProfileImage from "../general/UserProfileImage";

const DashboardNavbar: React.FC = () => {
    return (
        <div className="flex items-center p-4">

            <div className="flex w-full justify-end gap-4 items-center">
                <UserProfileImage />
                <ThemeTogglerButton />
            </div>
        </div>
    );
};

export default DashboardNavbar;