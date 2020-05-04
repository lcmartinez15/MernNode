import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import moment from "moment";

const ProfileEducation = ({
  education: { school, degree, fieldostudy, current, to, from, description },
}) => (
  <div>
    <div>
      <h3 class="text-dark">{school}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment>-{" "}
        {!to ? " Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {fieldostudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  </div>
);

ProfileEducation.propTypes = {};

export default ProfileEducation;
