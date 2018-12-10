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
    let { ordered, data, project, users } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              let item = data[e];

              if(!item || item.removed === 1) return null;
              
              let nPro = !!project.data[item.projectId] ? project.data[item.projectId].name : "";
              let nUser = !!users.data[item.memberId] ? users.data[item.memberId].fullname : "";
              
              let now = Date.now();
              let process = {
                liClass : "success",
                text    : "Complete"
              }

              if(item.process < 100){
                if(now >= item.begin && now <= item.end)
                  process = { liClass : "info", text    : "Pending" };
                
                if(now > item.end )
                  process = { liClass : "danger", text: "Not complete" };

                if(now < item.begin)
                  process = { liClass : "default", text: "Not implemented yet" };
              }

              if(!!item.finish) process = { liClass : "success", text    : "Done" }

              return (
                <tr key={i}>
                  <td className="text-center">
                    <span className="font-medium">{i}</span>
                  </td>

                  <td>
                    <span className="font-medium">{item.name}</span>
                  </td>

                  <td>
                    <Link to={`/report/project/${item.projectId}`}>
                      {nPro}
                    </Link>
                  </td>

                  <td className="text-center">
                    <span className="font-medium">{nUser}</span>
                  </td>

                  <td className="text-center">
                    {!!item.begin ? convertDMY(item.begin) : ""}
                  </td>


                  <td className="text-center">
                    {!!item.end ? convertDMY(item.end) : ""}
                  </td>

                  <td className="text-center">
                    {!!item.timeFisnish ? convertDMY(item.timeFisnish) : ""}
                  </td>

                  <td className="text-center">
                    <span className={`label label-${process.liClass}`}>
                      {process.text}
                    </span>
                  </td>

                  <td className="text-center">
                    <Link to={`/report/task/${e}`} className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
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