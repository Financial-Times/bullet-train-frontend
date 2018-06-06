import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			name: props.name
		};
	}

	close() {
		closeModal();
	}

	submit = (e) => {
		const {organisation} = this.props;
		e.preventDefault()
		if (this.state.challenge == organisation.name) {
			this.close();
			this.props.cb()
		}
	};

	render() {
		const {organisation} = this.props;
		return (
			<ProjectProvider>
				{() => (
					<form onSubmit={this.submit}>
						<p>
							This will remove <strong>{organisation.name}</strong> and <strong>all of it's
							projects</strong>. You should ensure that you do not contain any references to this
							organisation in your applications before proceeding.
						</p>
						<InputGroup
							inputProps={{className: "full-width"}}
							title="Please type the organisation name to confirm"
							placeholder="Organisation name"
							onChange={(e) => this.setState({challenge: Utils.safeParseEventValue(e)})}/>

						<FormGroup className="text-right">
							<Button
								disabled={this.state.challenge != organisation.name}
								className={"btn btn-primary"}>
								Confirm changes
							</Button>
						</FormGroup>
					</form>
				)}
			</ProjectProvider>
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
