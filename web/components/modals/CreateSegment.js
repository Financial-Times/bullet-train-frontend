import React, { Component, PropTypes } from 'react';
import engine from 'bullet-train-rules-engine';
import Rule from './Rule';
import Highlight from '../Highlight';
import SegmentStore from '../../../common/stores/segment-list-store';

const CreateSegment = class extends Component {
    static displayName = 'CreateSegment'

    constructor(props, context) {
        super(props, context);
        ES6Component(this);
        const { description, name, id, rules = [] } = this.props.segment && this.props.segment.rules.length ? _.cloneDeep(this.props.segment)
            : {
                rules: [{
                    type: 'ALL',
                    rules: [
                        {
                            type: 'ANY',
                            conditions: [
                                { ...Constants.defaultRule },
                            ],
                        },
                    ],
                }],
            };

        this.state = {
            tab: 0,
            description,
            name,
            rules,
            id,
            data: '{\n}',
        };
        this.listenTo(SegmentStore, 'saved', () => {
            this.close();
        });
    }

    addRule = () => {
        const rules = this.state.rules;
        rules[0].rules = rules[0].rules.concat({
            type: 'ANY',
            conditions: [
                { ...Constants.defaultRule },
            ],
        });
        this.setState({ rules });
    }

    updateRule = (rulesIndex, elementNumber, newValue) => {
        const { rules } = this.state;
        rules[0].rules[elementNumber] = newValue;
        this.setData(this.state.exampleData);
        this.setState({ rules });
    }

    removeRule = (rulesIndex, elementNumber) => {
        const { rules } = this.state;
        rules[0].rules.splice(elementNumber, 1);
        this.setData(this.state.exampleData);
        this.setState({ rules });
    }

    close() {
        closeModal();
    }


    componentDidMount = () => {
        this.focusTimeout = setTimeout(() => {
            this.input.focus();
            this.focusTimeout = null;
        }, 500);
    };

    componentWillUnmount() {
        if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
        }
    }


    save = (e) => {
        Utils.preventDefault(e);
        const { state: { description = '', id, name, rules } } = this;
        if (name) {
            if (this.props.segment) {
                AppActions.editSegment(this.props.projectId, { description, name, rules, id: this.props.segment.id });
            } else {
                AppActions.createSegment(this.props.projectId, { description, name, rules });
            }
        }
    };

    setData = (data) => {
        try {
            data = JSON.parse(data);
            engine(data, this.state.rules)
                .then((ruleEval) => {
                    this.setState({ exampleData: data, ruleEval });
                });
        } catch (e) {
        }

        // this.codeEditor.highlightCode();
        // this.setState({data})
    }

    get segmentOperator() {
        return [
            {
                'value': 'EQUAL',
                'label': 'Exactly Matches (=)',
            },
            {
                'value': 'NOT_EQUAL',
                'label': 'Does not match (!=)',
            },
            {
                'value': 'PERCENTAGE_SPLIT',
                'label': '% Split',
            },
            {
                'value': 'GREATER_THAN',
                'label': '>',
            },
            {
                'value': 'GREATER_THAN_INCLUSIVE',
                'label': '>=',
            },
            {
                'value': 'LESS_THAN',
                'label': '<',
            },
            {
                'value': 'LESS_THAN_INCLUSIVE',
                'label': '<=',
            },
            {
                'value': 'CONTAINS',
                'label': 'Contains',
            },
            {
                'value': 'NOT_CONTAINS',
                'label': 'Does not contain',
            },
            {
                'value': 'REGEX',
                'label': 'Matches regex',
            },
        ];
    }

    render() {
        const { name, description, rules, isSaving, hasFeature, createSegment, editSegment } = this.state;
        const { isEdit, identity } = this.props;

        const rulesEl = (
            <div className="panel--grey overflow-visible">
                <div>
                    <FormGroup>
                        {rules[0].rules.map((rule, i) => (
                            <div key={i}>
                                {i > 0 && (
                                    <Row className="and-divider">
                                        <Flex className="and-divider__line"/>
                                        AND
                                        <Flex className="and-divider__line"/>
                                    </Row>
                                )}
                                <Rule
                                  data-test={`rule-${i}`}
                                  rule={rule}
                                  operators={this.segmentOperator}
                                  onRemove={v => this.removeRule(0, i, v)}
                                  onChange={v => this.updateRule(0, i, v)}
                                />
                            </div>
                        ))}
                    </FormGroup>
                    <div
                      onClick={this.addRule} style={{ marginTop: 20 }}
                      className="text-center"
                    >
                        <Button data-test="add-rule" type="button" className="btn btn--anchor">
                            ADD RULE
                        </Button>
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                {this.state.tab === 0 ? (
                    <form
                      id="create-segment-modal"
                      onSubmit={this.save}
                    >
                        <FormGroup className="mb-4">
                            <InputGroup
                              ref={e => this.input = e}
                              data-test="segmentID"
                              inputProps={{
                                  className: 'full-width',
                                  name: 'segmentID',
                              }}
                              value={name}
                              onChange={e => this.setState({ name: Format.enumeration.set(Utils.safeParseEventValue(e)).toLowerCase() })}
                              isValid={name && name.length}
                              type="text" title={isEdit ? 'ID' : 'ID*'}
                              placeholder="E.g. power_users"
                            />
                        </FormGroup>

                        <FormGroup className="mb-4">
                            <InputGroup
                              value={description}
                              inputProps={{
                                  className: 'full-width',
                                  readOnly: !!identity,
                                  name: 'featureDesc',
                              }}
                              onChange={e => this.setState({ description: Utils.safeParseEventValue(e) })}
                              isValid={name && name.length}
                              type="text" title="Description (optional)"
                              placeholder="e.g. 'People who have spent over $100' "
                            />
                        </FormGroup>

                        <div className="form-group ">
                            <label className="cols-sm-2 control-label">Include users when</label>
                            {
                                rulesEl
                            }
                        </div>

                        <div className="text-right">
                            {isEdit ? (
                                <Button
                                  type="submit" data-test="update-segment" id="update-feature-btn"
                                  disabled={isSaving || !name}
                                >
                                    {isSaving ? 'Creating' : 'Update Segment'}
                                </Button>
                            ) : (
                                <Button
                                  type="submit" data-test="create-segment" disabled
                                  id="create-feature-btn"
                                  disabled={isSaving || !name}
                                >
                                    {isSaving ? 'Creating' : 'Create Segment'}
                                </Button>
                            )}
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="hljs-container">
                            <Highlight
                              ref={e => this.codeEditor = e} onChange={(text) => {
                                  this.setData(text);
                              }} className="json"
                            >
                                {this.state.data}
                            </Highlight>
                        </div>
                        <div className="text-center">Paste in your user JSON to see if they belong to your segment</div>
                        {rulesEl}
                    </div>
                )}
            </div>
        );
    }
};
CreateSegment.propTypes = {};

module.exports = hot(module)(ConfigProvider(CreateSegment));
