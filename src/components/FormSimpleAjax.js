import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { stringify } from 'qs'
import { serialize } from 'dom-form-serializer'

import './Form.css'

class Form extends React.Component {
  static defaultProps = {
    name: 'Köksrenovering Stockholm',
    subject: 'Offert/Förfrågan', // optional subject of the notification email
    action: 'https://formspree.io/xlepjnol',
    method: 'POST',
    successMessage: 'Tack för din förfrågan, vi hör av oss inom kort',
    errorMessage: 'Nått gick snett, var vänlig e-maila eller ring oss.'
  }

  state = {
    alert: '',
    disabled: false
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.disabled) return

    const form = e.target
    const data = serialize(form)
    this.setState({ disabled: true })
    fetch(form.action, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        //'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:  stringify(data),
    })
      .then(res => {
        if (res.ok) {
          return res
        } else {
          console.log(res);
         //throw new Error('Network error')
        }
      })
      .then(() => {
        form.reset()
        this.setState({
          alert: this.props.successMessage,
          disabled: false
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          disabled: false,
          alert: this.props.errorMessage
        })
      })
  }

  render() {
    const { name, subject, action } = this.props

    return (
      <Fragment>
        <Helmet>
          {<script src="https://www.google.com/recaptcha/api.js" />}
        </Helmet>
        <form
          className="Form"
          name={name}
          action={action}
          onSubmit={this.handleSubmit}
         
        >
          {this.state.alert && (
            <div className="Form--Alert">{this.state.alert}</div>
          )}
         
           <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="text"
                placeholder="Namn"
                name="name"
                required
              />
              <span>Namn</span>
            </label>
          <label className="Form--Label">
            <input
              className="Form--Input Form--InputText"
              type="email"
              placeholder="E-post"
              name="_replyto"
              required
            />
            <span>E-post</span>
          </label>
          <label className="Form--Label">
            <input
              className="Form--Input Form--InputText"
              type="text"
              placeholder="Telefonnummer"
              name="telePhone"
              required
            />
            <span>Telefonnummer</span>
          </label>
          <label className="Form--Label">
            <textarea
              className="Form--Input Form--Textarea Form--InputText"
              placeholder="Meddelande"
              name="message"
              rows="10"
              required
            />
            <span>Meddelande</span>
          </label>
          <div className="g-recaptcha" data-sitekey="6Lf7gPwUAAAAAGD5RgY4pdjRMGn7n7ynDEBNNrdw"></div>
          {!!subject && <input type="hidden" name="subject" value={subject} />}
          <input type="hidden" name="form-name" value={name} />
          <input
            className="Button Form--SubmitButton"
            type="submit"
            value="Skicka meddelande"
            disabled={this.state.disabled}
          />
        </form>
      </Fragment>
    )
  }
}

export default Form
