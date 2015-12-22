import React, {Component} from 'react';

export default class StatisticItem extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    let size = this.props.item.size || "";
    const hideLabel = this.props.item.hideLabel;
    let labelOrientation = this.props.item.labelOrientation || "";
    let labelOrderFirst = this.props.item.labelOrder === "first";
    let labelColor = this.props.item.labelColor;
    let valueColor = this.props.item.valueColor || "";
    let valueIcon = this.props.item.valueIcon || "";
    let iconOrderFirst = this.props.item.iconOrder === "first";
    let iconSize = this.props.item.iconSize;
    let fontStyles = this.props.item.fontStyles;
    //const ovParams = this.props.item.ovParams;

    if(iconSize)
      valueIcon += ` ${iconSize}`;

    let labelStyles = {padding: "0px 5px"};
    let valueStyles = {padding: "0px 5px"};

    if(labelColor)
      labelStyles.color = labelColor;

    if(fontStyles.bold)
      valueStyles.fontWeight = 'bold';

    if(fontStyles.italic)
      valueStyles.fontStyle = 'italic';

    if(fontStyles.underline)
      valueStyles.textDecoration = 'underline';

    let classes = `ui ${labelOrientation} ${size} statistic`;

    valueStyles.color = valueColor;

    classes = classes.split(" ").filter(function(item){
      return item.trim().length > 0;
    }).join(" ");

    let labelComponent = hideLabel ? null : (
      <div key="lbl" className="label" style={labelStyles}>
        {iconOrderFirst && this.props.item.iconPosition === 'label' ? <i className={valueIcon}></i> : null}
        {this.props.item.label}
        {!iconOrderFirst && this.props.item.iconPosition === 'label' ? <i className={valueIcon}></i> : null}
      </div>
    );

    let valueComponent = (
        <div key="val" className="value" style={valueStyles}>
          {iconOrderFirst && this.props.item.iconPosition === 'value' ? <i className={valueIcon}></i> : null}
          {this.props.item.value}
          {!iconOrderFirst && this.props.item.iconPosition === 'value' ? <i className={valueIcon}></i> : null}
        </div>
      );

    let content = [];
    if(labelOrderFirst) {
      content.push(labelComponent);
      content.push(valueComponent);
    } else {
      content.push(valueComponent);
      content.push(labelComponent);
    }

    let statisticItem = statisticItem = (
      <div className="statistic">
        <div className={`ui one ${size} statistics`}>
          <div className={classes}>
            {content}
          </div>
        </div>
      </div>
    );

    /*
    if(ovParams) {
      statisticItem = (
        <div className="ui statistic">
          <div className={`ui one ${size} statistics`}>
            <div className={classes}>
              {content}
            </div>
          </div>
        </div>
      );
    } else {
      statisticItem = (
        <div className={classes}>
          {content}
        </div>
      );
    }
    */

    return statisticItem;
  }
}