import React, { Component } from 'react';
import Pusher from 'pusher-js';
import './App.css';
import './img/bmilk.png'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessage: '',
      conversation: [],
    };
    this.scrollView = null;
  }

  componentDidMount() {
    const pusher = new Pusher("7bee5482284661a95c11", {
      cluster: "us2",
      encrypted: true,
    });

    const channel = pusher.subscribe('bot');
    channel.bind('bot-response', data => {
      const msg = {
        text: data.message,
        user: 'ai',
      };
      this.setState({
        conversation: [...this.state.conversation, msg],
      },
      this.scrollEnd
    );
    });
    
  };
  scrollEnd = () => {
    this.scrollView.scrollTo(0,99999999999);
  };

  handleChange = event => {
    this.setState({ userMessage: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.userMessage.trim()) return;

    const msg = {
      text: this.state.userMessage,
      user: 'human',
    };

    this.setState({
      conversation: [...this.state.conversation, msg],
    },
    this.scrollEnd
  );

    fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: this.state.userMessage,
      }),
    });

    this.setState({ userMessage: '' });

    // const chatDiv = document.querySelector('.conversation-view');
    // const chatComputedStyle = window.getComputedStyle(chatDiv);
    // const chatPaddingBottom = chatComputedStyle.getPropertyValue('padding-boottom');
    // const chatPaddingBottomValue = chatPaddingBottom.slice(0, chatPaddingBottom.length - 2);
    // chatDiv.scrollTop = chatDiv.scrollHeight + chatDiv.lastChild.offsetHeight + chatPaddingBottomValue;    
  };

  render() {
    const ChatBubble = (text, i, className) => {
      return (
        <div key={`${className}-${i}`} className={`${className} chat-bubble`}>
          <span className="chat-content">{text}</span>
        </div>
      );
    };

    const chat = this.state.conversation.map((e, index) =>
      ChatBubble(e.text, index, e.user)
    );

    return (
      <div>
          <h1>SEGUROS Bad-Milk</h1>
          <img className="bmilk" src={require("./img/bmilk.png")} alt="satasa"/>
        <div className="texto">
            <h2 className="texto">LAS MEJORES ALTERNATIVAS EN LAS ASEGURADORAS MAS CONFIABLES</h2>
            <p>Compañias con las que trabajamos:</p>
            <img src={require("./img/allianz.png")} alt="satasa"/>
            <img src={require("./img/mapfre.png")} alt="satasa"/>
            <img src={require("./img/zurich.png")} alt="satasa"/>
            <img src={require("./img/provincia-seguros.png")} alt="satasa"/>
            <hr></hr>
            <div className="blabla">
            La compañía de seguros dispone de un Servicio de Atención que atenderá las consultas y reclamos que presenten los tomadores de seguros, asegurados, beneficiarios y/o derechohabientes. En caso de que el reclamo no haya sido resuelto o que haya sido denegada su admisión o desestimado, total o parcialmente, podrá comunicarse con la Superintendencia de Seguros de la Nación por teléfono al <b>0800-666-8400</b>, correo electrónico a denuncias@ssn.gob.ar o por formulario web.
            <img classname="autito" src={require("./img/seguro.png")} alt="satasa"/> 
            </div>
        </div>

        <div className="chat-window">
          <div className="titulo-chat">Haga su consulta aqui</div>
          <div ref={(view) => (this.scrollView = view)} className="conversation-view">{chat}</div>
          <div className="message-box">
            <form onSubmit={this.handleSubmit}>
              <input
                value={this.state.userMessage}
                onInput={this.handleChange}
                className="text-input"
                type="text"
                autoFocus
                placeholder="Escriba su mensaje y presione enter..."
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;