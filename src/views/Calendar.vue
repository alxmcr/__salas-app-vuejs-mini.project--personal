<template>
<div class="calendar">
    <!--TOOLBAR-->
    <v-toolbar flat color="white">
        <v-toolbar-title>Calendar</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-divider
            class="mx-2"
            inset
            vertical
            ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">New Event</v-btn>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6>
                                <v-select
                                    v-model="editedItem.resourceId"
                                    :items="config.resources"
                                    item-text="title"
                                    item-value="id"
                                    label="Rooms"></v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                    v-model="editedItem.user_id"
                                    :items="users"
                                    item-value="id"
                                    label="users">
                                    <template slot="selection" slot-scope="data">
                                        {{ data.item.name }}
                                    </template>
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.name }} {{ data.item.lastname }} 
                                    </template>
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field   v-model="editedItem.title" 
                                    label="Title"
                                    required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-menu
                                    :close-on-content-click="false"
                                    v-model="menu1"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                    >
                                    <v-text-field
                                        slot="activator"
                                        v-model="editedItem.date"
                                        label="Date"
                                        prepend-icon="event"
                                        readonly
                                        required></v-text-field>
                                    <v-date-picker  v-model="editedItem.date" 
                                        @input="menu1 = false"></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-dialog
                                    ref="menuStart"
                                    v-model="modal1"
                                    :return-value.sync="editedItem.start"
                                    persistent
                                    lazy
                                    full-width
                                    width="290px">
                                    <v-text-field
                                        slot="activator"
                                        v-model="editedItem.start"
                                        label="Start"
                                        prepend-icon="access_time"
                                        readonly></v-text-field>
                                    <v-time-picker
                                        v-if="modal1"
                                        v-model="editedItem.start"
                                        full-width>
                                        <v-spacer></v-spacer>
                                        <v-btn  flat color="primary" 
                                                @click="modal1 = false">Cancel</v-btn>
                                        <v-btn flat color="primary" 
                                            @click="$refs.menuStart.save(editedItem.start)">OK</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-dialog
                                    ref="menuEnd"
                                    v-model="modal2"
                                    :return-value.sync="editedItem.end"
                                    persistent
                                    lazy
                                    full-width
                                    width="290px">
                                    <v-text-field
                                        slot="activator"
                                        v-model="editedItem.end"
                                        label="End"
                                        prepend-icon="access_time"
                                        readonly></v-text-field>
                                    <v-time-picker
                                        v-if="modal2"
                                        v-model="editedItem.end"
                                        full-width>
                                        <v-spacer></v-spacer>
                                        <v-btn  flat color="primary" 
                                                @click="modal2 = false">Cancel</v-btn>
                                        <v-btn flat color="primary" 
                                            @click="$refs.menuEnd.save(editedItem.end)">OK</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn  v-if="editedItem.id"
                        color="red darken-1" flat 
                        @click="deleteItem(editedItem)">Delete</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                    <v-btn color="green darken-1" flat @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-toolbar>
    <!--CONTENT-->
    <v-container align-center>
        <full-calendar :config="config" :events="config.events" />
    </v-container>
</div>
</template>

<script>
// FULLCALENDAR: Config
import configFullCalendar from '../plugins/fullcalendar.js';

// FULLCALENDAR AND SCHEDULER
import {
    FullCalendar
} from 'vue-full-calendar'
import $ from 'jquery';
import 'fullcalendar';
import "fullcalendar-scheduler";
import "fullcalendar/dist/fullcalendar.min.css";
import "fullcalendar-scheduler/dist/scheduler.min.css";

// API
import APIEvents from '../api/eventsAPI.js';
import APIUsers from '../api/usersAPI.js';
import APIRooms from '../api/roomsAPI.js';

// Moment
import moment from 'moment';

// Components
import Event from "@/components/Event.vue";
import Room from "@/components/Room.vue";

export default {
    components: {
        Event,
        FullCalendar,
    },
    data: function() {
        let vm = this;

        return {
            // Users
            users: [],
            oldItem: {
                resourceId: '',
                user_id: '',
                title: '',
                date: '',
                start: '',
                end: ''
            },
            // editedItem
            editedItem: {
                resourceId: '',
                user_id: '',
                title: '',
                date: '',
                start: '',
                end: ''
            },
            editedIndex: -1,
            // Vuetify
            dialog: false,
            modal1: false,
            modal2: false,
            menu1: false,
            menu2: false,
            menu3: false,
            // Fullcalendar-Scheduler
            config: {
                schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
                defaultView: "timelineDay",
                header: {
                    left: "prev,next",
                    center: "title",
                    right: "timelineDay,timelineWeek,timelineMonth"
                },
                resourceLabelText: "Rooms",
                resources: [],
                editable: true,
                events: [],
                eventOverlap: false,
                slotEventOverlap: false,
                eventColor: '#f44336',
                eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
                    console.log('eventResize');

                    // Properties
                    const id = event.id;

                    // Events
                    var allEvents = $('#calendar').fullCalendar('clientEvents');

                    // transformation
                    const eventPut = vm.transformEventCalendarToPutAPI(event);

                    vm.processingUpdateEvent(allEvents, id, eventPut);
                },
                eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {

                    console.log('eventDrop');

                    // Properties
                    const id = event.id;

                    // Events
                    var allEvents = $('#calendar').fullCalendar('clientEvents');

                    // transformation
                    const eventPut = vm.transformEventCalendarToPutAPI(event);

                    vm.processingUpdateEvent(allEvents, id, eventPut);
                },
                eventClick: function(event, jsEvent, view) {
                    try {
                        // Get Index
                        const id = event.id;
                        const index = vm.config.events.map(function(e) {
                            return e.id;
                        }).indexOf(id);

                        // build
                        const eventForm = vm.buildEventCalendarView(event);

                        vm.editedIndex = index;
                        vm.oldItem = Object.assign({}, eventForm);
                        vm.editedItem = Object.assign({}, eventForm);
                        vm.dialog = true;
                    } catch (error) {
                        console.error(error);
                    }

                },
            },
        }
    },
    async created() {

        // API
        const users = await APIUsers.getUsersAPI();
        const rooms = await APIRooms.getRoomsAPI();
        const events = await APIEvents.getEventsCalendar();

        // Users
        this.users = users;

        // Full Calendar
        this.config.resources = rooms;
        this.config.events = events;

        // Full Calendar
        this.config.resources.forEach(resource => {
            $('#calendar').fullCalendar('addResource', resource);
        })
    },
    methods: {
        // Vuetify
        initialize: async function() {
            const events = await APIEvents.getEventsVuetify();
            // updated
            this.config.events = events;
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
            }, 500)
        },
        save: async function() {

            try {
                // Auxiliar variable
                const event = this.editedItem;

                const isOKProperties = this.isPropertiesValid(event);

                if (isOKProperties) {

                    // Events
                    var allEvents = $('#calendar').fullCalendar('clientEvents');

                    // Properties
                    const id = event.id;

                    if (typeof id === 'undefined' || id === '' || id === null) {
                        console.log('POST');

                        // transformation
                        const eventPost = this.transformEventToPostAPI(event);

                        const isOverlap = this.isAnOverlapEvent(allEvents, eventPost);

                        if (isOverlap) {
                            const msgError = 'Error, This event overlaps another event';
                            console.error(msgError);
                            alert(msgError);
                        } else {
                            console.log('saving...');

                            this.postEventAPI(eventPost);

                            // Close modal
                            this.close();
                        }
                    } else {
                        console.log('PUT');

                        // transformation
                        const eventPut = this.transformEventFormToPutAPI(event);

                        this.processingUpdateEvent(allEvents, id, eventPut);
                    }
                } else {
                    const error = 'Error, Event is not valid';
                    console.error(error);
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        processingUpdateEvent(allEvents, id, eventPut) {
            const allEventsWithoutEvent = allEvents.filter(event => event.id !== id);

            const isOverlap = this.isAnOverlapEvent(allEventsWithoutEvent, eventPut);
            console.log('isOverlap', isOverlap);

            if (isOverlap) {
                const msgError = 'Error, This event overlaps another event';
                console.error(msgError);
                alert(msgError);
            } else {
                console.log('updating...');

                this.putEventAPI(id, eventPut);
            }
        },
        transformEventFormToPutAPI(event) {
            try {
                const date = event.date;
                const dateStart = moment.utc(`${event.date}T${event.start}`);
                const dateEnd = moment.utc(`${event.date}T${event.end}`);
                // eventBuilt
                const eventBuilt = {
                    // Event exist
                    id: event.id,
                    title: event.title,
                    resourceId: event.resourceId,
                    overlap: event.overlap,
                    user_id: event.user_id,
                    start: dateStart,
                    end: dateEnd
                };
                return eventBuilt;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        isAnOverlapEvent(events, eventToCheck) {
            // Properties
            const resourceID = eventToCheck.resourceId;

            // Moment.js objects
            const startMoment = eventToCheck.start;
            const endMoment = eventToCheck.end;

            try {
                if (moment.isMoment(startMoment) && moment.isMoment(endMoment)) {

                    // Filter Events by a specific resource
                    const eventsByResource = events.filter(event => event.resourceId === resourceID);

                    for (let i = 0; i < eventsByResource.length; i++) {

                        const eventA = eventsByResource[i];

                        if (moment.isMoment(eventA.start) && moment.isMoment(eventA.end)) {

                            // start-time in between any of the events
                            if (moment(startMoment).isAfter(eventA.start) && moment(startMoment).isBefore(eventA.end)) {
                                console.log("start-time in between any of the events")
                                return true;
                            }
                            //end-time in between any of the events
                            if (moment(endMoment).isAfter(eventA.start) && moment(endMoment).isBefore(eventA.end)) {
                                console.log("end-time in between any of the events")
                                return true;
                            }
                            //any of the events in between/on the start-time and end-time
                            if (moment(startMoment).isSameOrBefore(eventA.start) && moment(endMoment).isSameOrAfter(eventA.end)) {
                                console.log("any of the events in between/on the start-time and end-time")
                                return true;
                            }
                        } else {
                            const error = 'Error, Any event on array of events is not valid. start or end are not Moment objects';
                            console.error(error);
                            throw new Error(error);
                        }
                    }
                    return false;
                } else {
                    const error = 'Error, start or end are not Moment objects';
                    console.error(error);
                    throw new Error(error);
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async postEventAPI(item) {
            try {
                // POST
                const responsePOST = await APIEvents.postEventAPI(item);
                // New Event
                this.config.events.push(responsePOST);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async putEventAPI(id, event) {
            try {
                // PUT
                const responsePUT = await APIEvents.putEventAPI(id, event);

                // Refresh the calendar
                this.refreshEventUpdatedCalendar(responsePUT);

                // Close modal
                this.close();
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async deleteItem(item) {
            try {
                // Delete ITEM
                const id = item.id;
                const index = this.config.events.map(function(e) {
                    return e.id;
                }).indexOf(id);
                if (confirm('Are you sure you want to delete this item?') === true) {
                    // DELETE
                    const eventResponse = await APIEvents.deleteEventAPI(id);
                    // Data
                    this.config.events.splice(index, 1);
                }
                this.close()
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        refreshEventUpdatedCalendar(event) {
            try {
                const id = event.id;

                // get a position
                const pos = this.config.events.map(function(e) {
                    return e.id;
                }).indexOf(id);

                // update calendar
                Object.assign(this.config.events[pos], event);

                // Update view
                $('#calendar').fullCalendar('updateEvent', event);
                $('#calendar').fullCalendar('updateEvents', this.config.events);
                $('#calendar').fullCalendar('refetchEvents');
                $('#calendar').fullCalendar('rerenderEvents');

            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        transformEventCalendarToPutAPI(event) {
            try {
                if (moment.isMoment(event.start) && moment.isMoment(event.end)) {
                    // eventBuilt
                    const eventBuilt = {
                        // Event exist
                        id: event.id,
                        title: event.title,
                        resourceId: event.resourceId,
                        overlap: event.overlap,
                        user_id: event.user_id,
                        start: event.start.utc(),
                        end: event.end.utc()
                    };
                    return eventBuilt;
                } else {
                    const error = "Error, Start time and End Time are not Moment objects.";
                    console.error(error);
                    throw new Error(error);
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        transformEventToPostAPI(event) {
            try {
                const date = event.date;
                const dateStart = moment.utc(`${event.date}T${event.start}`);
                const dateEnd = moment.utc(`${event.date}T${event.end}`);
                // eventBuilt
                const eventBuilt = {
                    // For default
                    overlap: false,
                    title: event.title,
                    resourceId: event.resourceId,
                    user_id: event.user_id,
                    start: dateStart,
                    end: dateEnd
                };
                return eventBuilt;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        isPropertiesValid(event) {
            try {
                let result = false;

                // Fill all properties
                const isFillOK = this.isFillAllProperties(event);

                if (isFillOK) {
                    // Properties
                    const startDatetimeStr = event.start;
                    const endDatetimeStr = event.end;

                    // Moment.js: Times
                    const beginningTime = moment(startDatetimeStr, 'hh:mm');
                    const endTime = moment(endDatetimeStr, 'hh:mm');

                    // Time: start < end
                    const isTheTimesOK = beginningTime.isBefore(endTime);

                    if (isTheTimesOK) {
                        result = true;
                    } else {
                        const error = "Error, Start time can not be after End time";
                        console.error(error);
                        alert(error);
                    }
                } else {
                    const error = "Error, Event has fields empty";
                    console.error(error);
                    alert(error);
                }
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        isFillAllProperties(event) {
            try {
                return event.title !== '' &&
                    event.resourceId !== '' &&
                    event.user_id !== '' &&
                    event.date !== '' &&
                    event.start !== '' &&
                    event.end !== '';
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        buildEventCalendarView(event) {
            try {
                var date = moment(event.start).format('YYYY-MM-DD');
                var start = moment(event.start).format('HH:mm:ss');
                var end = moment(event.end).format('HH:mm:ss');
                // new event
                const newevent = {
                    id: event.id,
                    title: event.title,
                    resourceId: event.resourceId,
                    overlap: event.overlap,
                    user_id: event.user_id,
                    date,
                    start,
                    end
                };
                return newevent;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Event' : 'Edit Event'
        }
    },
}
</script>


<style lang="scss" scoped>
.container-calendar{
    height: 100vh;
}

.errors{
    background-color: rgb(194, 118, 118);
    color: white;
    margin: 10px;
    padding: 10px;
}

.events{
    margin-top: 10px;
}
</style>
