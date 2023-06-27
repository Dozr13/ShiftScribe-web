// import React, {
//   PropsWithChildren,
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';

// import { getIpAddressAsync, getNetworkStateAsync } from 'expo-network';

// const context = {
//   /**
//    * Fetch the user's IP adress.
//    * @returns Promise<string>
//    */
//   getIP: () => {
//     return getIpAddressAsync();
//   },
// };

// type ContextType = typeof context;

// interface ExtendedContext extends ContextType {
//   /**
//    * State that tells us if the user is connected to the internet.
//    *
//    * The context will automatically ping the network every 5 seconds to verify connectivity.
//    */
//   connected: boolean;
// }

// const NetworkContext = createContext(context as ExtendedContext);

// /**
//  * Utilize the network context.
//  *
//  * Provides states that change depending on the network status. Useful for verifying access access when offline.
//  * @returns NetworkContext
//  */
// export const useNetwork = () => useContext(NetworkContext);

// /**
//  * Provide network access to children components.
//  */
// export const NetworkProvider = ({ children }: PropsWithChildren<unknown>) => {
//   const [connected, setConnected] = useState<boolean>(false);

//   const poll = () => {
//     getNetworkStateAsync().then(async (res) => {
//       if (res.isInternetReachable !== undefined) {
//         setConnected(res.isInternetReachable);
//       }
//     });
//   };

//   useEffect(() => {
//     const interval = setInterval(poll, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <NetworkContext.Provider value={{ connected, ...context }}>
//       {children}
//     </NetworkContext.Provider>
//   );
// };
