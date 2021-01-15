'use strict';
self.addEventListener(
    'install', function (event) {
        event.waitUntil(
            self.skipWaiting()//ceka dok se nesto ne uradi. Moze da bude prazna
        );
    }
);
self.addEventListener('fetch', () => {});

self.addEventListener('push', function (event) {
    console.log('Received push');
    var notificationTitle = 'Zdravo svete';
    var notificationOptions = {
        body: 'Thanks for sending this push msg.',
        icon: 'icon',
        badge: 'badge',
        tag: 'simple-push-demo-notification',
        data: {
            url: 'https://developers.google.com/web/fundamentals/getting-started/push-notifications/'
        }
    };

    if (event.data) {
        var dataText = event.data.text();
        const obj = dataText? JSON.parse(dataText):""
        notificationTitle = 'Received Payload';
        notificationOptions.body = `Push data: ${obj.data || 'no-data'}`;
    }

    event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)]));//ovde se prikazuje notifikacija koju smo dobili od push servisa
});


self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.notification.data && event.notification.data.url) {
        clients.openWindow(event.notification.data.url);
    }
});