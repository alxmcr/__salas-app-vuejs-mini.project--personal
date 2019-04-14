export default {
    schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
    defaultView: "timelineDay",
    header: {
        left: "prev,next",
        center: "title",
        right: "timelineDay,timelineWeek,timelineMonth"
    },
    resourceLabelText: "Rooms",
    resources: [],
    events: [],
    eventColor: '#f44336',
    resourceRender: function(resource, cellEls) {
        console.log('resourceRender');
    },
    eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
        console.log('eventResize');
    },
    eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
        console.log('eventDrop');
    },
    eventClick: function(event, jsEvent, view) {
        console.log('eventClick');
    }
}
