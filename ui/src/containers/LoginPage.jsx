import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../auth/Auth';
import LoginForm from '../components/LoginForm.jsx';


class LoginPage extends Component {

    /**
     * Class constructor.
     */
    constructor(props, context) {
        
        super(props, context);

        const storedMessage = localStorage.getItem('successMessage');
        let successMessage = '';

        if (storedMessage) {
            successMessage = storedMessage;
            localStorage.removeItem('successMessage');
        }

        // set the initial component state
        this.state = {
            errors: {},
            successMessage,
            user: {
                username: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    /**
     * Process the form.
     *
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();

        // create a string for an HTTP body message
        const username = encodeURIComponent(this.state.user.username);
        const password = encodeURIComponent(this.state.user.password);

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((res) => { 
                return res.json()
         }).then((data) => {
             if (data.hasOwnProperty('token')){
              Auth.authenticateUser(data.token);
              this.props.history.push("/dashboard")
            }else{
                 const errors =  {};
                 errors.summary = data.message;
                 this.setState({
                     errors
                 });
            }

        })
    }

    /**
     * Change the user object.
     *
     * @param {object} event - the JavaScript event object
     */
    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });
    }

    /**
     * Render the component.
     */
    render() {
        return (
            <LoginForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                successMessage={this.state.successMessage}
                user={this.state.user}
            />
        );
    }

}

LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default LoginPage;
