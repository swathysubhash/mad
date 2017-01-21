





const initialState = {
	apis: {
		byIds: {},
		allIds: []
	},
	groups: {
		byIds: {},
		allIds: []
	},
	endpoints: {
		byIds: {},
		allIds: []
	}
}

export default function entities(state = initialState, action) {
  console.log('STATE', state, "ACTION", action)
  switch (action.type) {
  	case 'CREATE_API_SUCCESS'
  	default:
      return state
  }