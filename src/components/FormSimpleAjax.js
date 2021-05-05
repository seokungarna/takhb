import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { stringify } from 'qs'
import { serialize } from 'dom-form-serializer'

import './Form.css'

class Form extends React.Component {
  static defaultProps = {
    name: 'Takläggare Helsingborg',
    subject: 'Takläggare Helsingborg', // optional subject of the notification email
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
    if (data.info != '') {
      this.setState({
        alert: "Informationen skickad. Tack!",
        disabled: true
      })
        return
    }
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
        // throw new Error('Network error')
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
        {/* <Helmet>
          {<script src="https://www.google.com/recaptcha/api.js" />}
        </Helmet> */}
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
          {/* <div className="g-recaptcha" data-sitekey="6Lf7gPwUAAAAAGD5RgY4pdjRMGn7n7ynDEBNNrdw"></div> */}
          {!!subject && <input type="hidden" name="subject" value={subject} />}
          <input type="hidden" name="form-name" value={name} />
          <input type="hidden"  name="email" value="" />
          <input type="hidden"  name="info" placeholder="your info" value="" />
          {/* <input type="hidden" name="g-recaptcha-response" value="03AGdBq243iwZDwtDv5bMf9SnXeAJgalEo4t6Xpt3OLcB4d6eKsPBLlD1SxwojGFcAYUB94azmSe_u80YGfRO8eCX0HzqIGObQiOJvvq-g7fZNBeumBbvYRwQZK6w0yv4gu4XtRr11FafqPKqMHbFp3ws6JJF7KG5WpJWQsNekABJlovgjknLKJbt8CLUzsmrTD1VRow_8MdgRLpmddgqhPqN2ROWrxm0tz3r76bj2XArISv2TBpXfVBMorA_Jy3EHGENihCria4k1hrI4ejWgGsZZyagqVR6M3jYsc6DCNI9IIKJd3sy0ZgpI0TdRM-kaQaWHBnFZ6iHCz0UP6OO2FtmcOe2t9zOU9zLKUpY6m3rIoR6QQgGie2-TWccgIE4huVkpAkfi1d6baSwXRNB3zmJCIcBm3J9KyBdxggKFLm3PVoJOSkhZ5idH6lcosjv6sRlTgHbx533k-5CThYg3AtVxXL6PNPmOzaJgUsNpqEqIBCOMTTJKf4Y" ></input> */}
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
