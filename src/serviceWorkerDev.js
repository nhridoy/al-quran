export const serviceWorkerDev = () => {
  let serviceWorkerUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
  navigator.serviceWorker.register(serviceWorkerUrl).then((registration) => {
    console.log("Service Worker Registered");
  });
};
