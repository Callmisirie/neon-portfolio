export const useGetAdminUserID = () => {
    return window.localStorage.getItem("adminUserID");
};