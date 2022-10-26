# `nusmaps`
Cool app description

## Front-end

`src/theme/theme.js`

_Theme object taken from [material ui](https://mui.com/material-ui/customization/default-theme/#main-content)_
- [ ] Customize theme to our liking

<br/>

`src/contexts/AuthProvider.jsx`

_React context provider to allow access to shared data_
- [x] Provdie current user data from firebase auth to all child components

<br/>

`src/contexts/LocationProvider.jsx` (NOT Implemented)

_React context provvider to allow access to shared data_
- [x] Provdie current location data from maps api to all child components

<br/>

`src/pages/MapView.jsx`

_Map view for 'events'_
- [x] Add Mapbox map
- [ ] Display pins for list of events
  - [x] Display all pins
  - [ ] Display pins for list of events based on zoom level
- [x] Add popup to display event detials for pins on tap event
- [X] display current capcity, max capacity or nothing
- [X] Add conditional logic to display 'Join Event' button (For events with some capacity)
- [X] Add button logic for 'Join Event' (either increase 'capacity count', or add entire user object to an array
- [ ] Styling

<br/>

`src/pages/ListView.jsx`

 _List view for 'events'_
- [x] View list of events
- [x] Add sorting and filtering UI
- [x] Add sorting and filtering firestore queries
- [x] Add sort by 'earliest first'
- [ ] Add sort by 'nearest first' (firestore doesn't support this, need to fetch all events and filter on client side)
- [x] Display calculated distance from user
- [x] Display calculated time from event start time
- [X] display current capcity, max capacity or nothing
- [X] Add conditional logic to display 'Join Event' button (For events with some capacity)
- [X] Add button logic for 'Join Event' (either increase 'capacity count', or add entire user object to an array
- [ ] Add support for event images (If we have time)
- [ ] Styling


<br/>

`src/pages/Create.jsx`

_Create an 'event'_
- [x] Add create event functionality
- [ ] Add location input using maps API (user needs to drop location pin AND enter location details separately (e.g., COM3 Seminar Room 1))
  - [ ] Allow searching for coords (forward geocoding)
- [ ] Add input validation for form fields
- [ ] Make 'capacity' field optional (this will determine if users can or cannot join an event)
- [x] Repalce `<NativeSelect/>` component with toggle buttons
- [ ] Move entire page to a dialog/ modal if got time
- [ ] Styling

<br/>

`src/pages/CreatedEvents.jsx`

_List view for 'created event's_ (NOT Implemented, not sure what to call 'events' tbh)
- [ ] Add new tab for this route somehwere
- [ ] View list of created events
- [ ] Add update event functionality
- [ ] Add delete event functionality
- [ ] Styling

<br/>

`src/pages/Profile.jsx`

_Authenticated user details_
- [ ] Styling: clean up ui, add more user data if needed

<br/>

<br/>

`src/components/SearchBar.jsx`

_Allow searching_

- [X] Search ListView
- [ ] Search MapView
- [ ] Styling

<br/>

## Firestore
- [ ] Modify rules to only allow authenticated users to add/ edit events
- [ ] Add indexes for sorting and filtering queries

<br/>

# How to start

Clone `nusmaps`:

```sh
git clone https://github.com/chehoelau/nusmaps.git
```

Install all dependencies:

```sh
cd nusmaps
npm install
```

Create a `.env` in the root folder and provide your secrets from firebase console

Example:

```jsx
REACT_APP_API_KEY=""
REACT_APP_AUTH_DOMAIN=""
REACT_APP_PROJECT_ID=""
REACT_APP_STORAGE_BUCKET=""
REACT_APP_MESSAGING_SENDER_ID=""
REACT_APP_APP_ID=""
```

Run your App:

```sh
npm run start
```

