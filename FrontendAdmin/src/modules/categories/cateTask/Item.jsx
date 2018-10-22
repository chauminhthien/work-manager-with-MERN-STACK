import React, { Component } from 'react';

class Item extends Component {

  onClickEdit = (e) => () => {
    if(!!this.props.onClickEdit) this.props.onClickEdit(e);
  };

  onClickDelete = (e) => () => {
    if(!!this.props.onClickDelete) this.props.onClickDelete(e);
  };

  render() {
    let { ordered, data } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              if(data[e].removed === 1) return null;
              return (
                <tr key={i}>
                  <td className="text-center">
                    <span className="font-medium">{i}</span>
                  </td>

                  <td>
                    <span className="font-medium">{data[e].name}</span>
                  </td>

                  <td className="text-center">
                    <i className={data[e] ? data[e].icon : ""}></i>
                  </td>
                  <td className="text-center">
                  
                    <button onClick={ this.onClickEdit(e) } className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className=" ti-pencil" aria-hidden="true"></i>
                    </button>
                    <button onClick={ this.onClickDelete(e) } className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="ti-trash" aria-hidden="true"></i>
                    </button>
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