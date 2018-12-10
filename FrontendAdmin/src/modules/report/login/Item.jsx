import React, { Component } from 'react';
import { convertTime } from 'utils/format';

class Item extends Component {

  onClickEdit = (e) => () => {
    if(!!this.props.onClickEdit) this.props.onClickEdit(e);
  };

  onClickDelete = (e) => () => {
    if(!!this.props.onClickDelete) this.props.onClickDelete(e);
  };

  render() {
    let { ordered, data, users } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              let item = data[e];

              if(!item) return null;
              let nameU = !!users[item.userId] ? users[item.userId].fullname : "";
              let action = !item.type ? "Login" : "Logout";

              return (
                <tr key={i}>
                  <td className="text-center">
                    <span className="font-medium">{i}</span>
                  </td>

                  <td>
                    <span className="font-medium">{nameU}</span>
                  </td>

                  <td className="text-center">
                    <span className={`label label-${!item.type ? 'info': 'danger'}`}>
                      {action}
                    </span>
                  </td>
                  <td className="text-center">
                    {!!item.time ? convertTime(item.time) : ""}
                  </td>
 
                </tr>
              )
            })
          )
          : null
        }
      </tbody>
    );
  }
}
export default Item;