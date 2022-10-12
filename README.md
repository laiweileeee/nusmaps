# nusmaps

### Functionality 


##### Front-end
`AuthProvider.jsx`

_React context provider to allow access to shared data_
- [x] Provdie current user data from firebase auth to all child components 

<br/>

`LocationProvider.jsx` (NOT Implemented)

_React context provvider to allow access to shared data_ 
- [ ] Provdie current location data from maps api to all child components 

<br/>

`TopAppBar.jsx` 

_Top app bar for searching and user controls_
- [x] Add google auth sign-in/ sign-out flow
- [ ] Add search support for events data

<br/>

`MapView.jsx` 

_Map view for 'events'_
- [x] Add Mapbox map
- [ ] Display pins for list of events based on zoom level
- [ ] Add popup to display event detials for pins on click event 

<br/>

 `ListView.jsx` 
 
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

<br/>

`Create.jsx` 

_Create an 'event'_
- [x] Add create event functionality 
- [ ] Add location input using maps API
- [ ] Add input validation for form fields
- [ ] Clean up `<NativeSelect/>` component to follow the float label format (`<Select/>` from material ui couldn't work for me) 
- [ ] Move entire page to a dialog/ modal

<br/>

`CreatedEvents.jsx` 

_List view for 'created event's_ (NOT Implemented, not sure what to call 'events' tbh)
- [ ] View list of created events 
- [ ] Add update event functionality 
- [ ] Add delete event functionality 

<br/>

##### Firestore
- [ ] Modify rules to only allow authenticated users to add/ edit events 
- [ ] Add indexes for sorting and filtering queries   

<br/>

### Styling

`Profile.jsx`

_Authenticated user details_
- [ ] Clean up ui, add more user data if needed 

<br/>

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
