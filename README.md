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
- [ ] Provdie current location data from maps api to all child components 

<br/>

`src/components/TopAppBar.jsx` 

_Top app bar for searching and user controls_
- [x] Add google auth sign-in/ sign-out flow
- [ ] Add search support for events data
- [ ] Styling

<br/>

`src/pages/MapView.jsx` 

_Map view for 'events'_
- [x] Add Mapbox map
- [ ] Display pins for list of events based on zoom level
- [ ] Add popup to display event detials for pins on click event 
- [ ] Styling

<br/>

`src/pages/ListView.jsx` 
 
 _List view for 'events'_
- [x] View list of events
- [ ] Add sorting and filtering UI
- [ ] Add sorting and filtering firestore queries
- [ ] Display calculated distance from user 
- [ ] Display calculated time from event start time 
- [ ] Add conditional logic to display current capcity, max capacity or nothing
- [ ] Add conditional logic to display 'Join Event' button 
- [ ] Add button logic for 'Join Event' 
- [ ] Add support for event images (If we have time) 
- [ ] Styling


<br/>

`src/pages/Create.jsx` 

_Create an 'event'_
- [x] Add create event functionality 
- [ ] Add location input using maps API
- [ ] Add input validation for form fields
- [ ] Clean up `<NativeSelect/>` component to follow the float label format (`<Select/>` from material ui couldn't work for me) 
- [ ] Move entire page to a dialog/ modal
- [ ] Styling

<br/>

`src/pages/CreatedEvents.jsx` 

_List view for 'created event's_ (NOT Implemented, not sure what to call 'events' tbh)
- [ ] View list of created events 
- [ ] Add update event functionality 
- [ ] Add delete event functionality 
- [ ] Styling

<br/>

`src/pages/Profile.jsx`

_Authenticated user details_
- [ ] Styling: clean up ui, add more user data if needed 

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
REACT_APP_STORAGE_BUCKET="
REACT_APP_MESSAGING_SENDER_ID=""
REACT_APP_APP_ID=""
```

Run your App:

```sh
npm run start
```

