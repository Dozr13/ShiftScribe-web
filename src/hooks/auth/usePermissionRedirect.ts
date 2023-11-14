import { useEffect } from "react";
import { PermissionLevel } from "../../../lib";

function usePermissionRedirect(
  permissionThreshold: PermissionLevel,
  redirectFn: () => void,
  currentPermission: PermissionLevel,
) {
  useEffect(() => {
    if (currentPermission < permissionThreshold) redirectFn();
  }, [currentPermission, permissionThreshold, redirectFn]);
}

export default usePermissionRedirect;
