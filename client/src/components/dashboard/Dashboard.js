import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import DashboardActions from "../dashboard/DashboardActions";
import Education from "../dashboard/Education";
import Experience from "../dashboard/Experience";
import { getCurrentProfile } from "../../actions/profile";

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  console.log("user" + user);
  useEffect(() => {
    getCurrentProfile();
  }, []);

  console.log("profile" + profile);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h className="large text-primary"> Dashboard </h>{" "}
      <p className="lead">
        <i className="fas fa-user"> </i>Welcome {user && user.name}{" "}
      </p>{" "}
      {console.log("profile" + profile)}{" "}
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
        </Fragment>
      ) : (
        <Fragment>
          <p> You have not yet settup a profile, please add some info </p>{" "}
          <Link to="/create-profile" className="btn btn-primery my-1">
            Create Profile{" "}
          </Link>{" "}
        </Fragment>
      )}{" "}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
