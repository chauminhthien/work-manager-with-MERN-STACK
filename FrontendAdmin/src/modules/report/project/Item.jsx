import React, { Component } from 'react';
import { convertDMY } from 'utils/format';
import { Link } from 'react-router-dom';

class Item extends Component {

  onClickEdit = (e) => () => {
    if(!!this.props.onClickEdit) this.props.onClickEdit(e);
  };

  onClickDelete = (e) => () => {
    if(!!this.props.onClickDelete) this.props.onClickDelete(e);
  };

  render() {
    let { ordered, data, task } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              if(data[e].removed === 1) return null;
              let sT = 0;
              for(let i in task.data){
                if(task.data[i].projectId === e) ++sT;
              }

              return (
                <tr key={i}>
                  <td className="text-center">
                    <span className="font-medium">{i}</span>
                  </td>

                  <td>
                    <span className="font-medium">{data[e].name}</span>
                  </td>

                  <td className="text-center">
                    {!!data[e].begin ? convertDMY(data[e].begin) : ""}
                  </td>
                  <td className="text-center">
                    {!!data[e].end ? convertDMY(data[e].end) : ""}
                  </td>
                  <td className="text-center">
                    <span className={`label label-${!!data[e].finish ? "success": "info"}`}>
                    {!!data[e].finish ? "Done": "Pending"}
                    </span>
                  </td>
                  <td className="text-center">
                    { sT }
                  </td>
                  <td className="text-center">
                  
                    <Link to={`/report/project/${e}`} className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className=" ti-eye" aria-hidden="true"></i>
                    </Link>
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