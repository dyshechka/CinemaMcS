import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from "moment/moment";
import {Button, Card, Input, Row} from "reactstrap";
import {loadHalls} from "../../actions/hall_actions";
import {
    cleanDateInSchedule,
    cleanFilmFormatInSchedule,
    cleanFilmInSchedule, cleanHallInSchedule,
    cleanScheduleFilmFormats,
    cleanScheduleFilms, cleanScheduleFreeTime,
    cleanScheduleSeances, cleanTimeInSchedule, deleteSeance, getFilmFormats,
    getFilmsDate, getFreeTimes,
    loadSeancesForDateAndHall, selectDateInSchedule, selectFilmFormatInSchedule, selectHallInSchedule
} from "../../actions/schedule_actions";
import {getFormattedDate, formatDuration} from "../../util/formatters";
import AddSeance from "./AddSeance";

class OrderPayment extends Component {

    componentDidMount() {
        this.props.loadHalls();
    }

    state = {
        showAddSeanceButton: false,
        deleteSeance: null
    };

    getDates = () => {
        let days = [];
        days.push(<option key={"month-stub"}>{"Выберите день"}</option>);
        for (let i = 0; i < 7; i++) {
            let m = moment(new Date());
            m.add(i, 'days');
            m.days();
            days.push(<option key={"month-" + i}>{m.format("D.M.YYYY")}</option>);
        }

        return days;
    };

    getHalls = () => {
        let halls = [];
        halls.push(<option key={"hall-stub"}>{"Выберите зал"}</option>);
        const generated = this.props.halls ? this.props.halls.map(hall => (<option key={"hall-" + hall.id}>{hall.name}</option>)) : "";
        halls = halls.concat(generated);
        return halls;
    };

    selectDate = (e) => {
        const incDate = e.target.value;
        if (incDate === "Выберите день") {
            return;
        }
        const incDates = incDate.split("\.");
        let date = new Date(incDates[2], incDates[1] - 1, incDates[0]);
        this.props.selectDateInSchedule(date.getTime());
        this.props.cleanScheduleSeances();
        this.props.cleanScheduleFilms();
        this.props.cleanScheduleFreeTime();
        this.props.cleanScheduleFilmFormats();
    };

    selectHall = (e) => {
        const hallName = e.target.value;
        if (hallName === "Выберите зал") {
            return;
        }
        const hallId = this.props.halls ? this.props.halls.filter(hall => hall.name === hallName)[0].id : null;
        this.props.selectHallInSchedule(hallId);
        this.props.cleanScheduleSeances();
        this.props.cleanScheduleFilms();
        this.props.cleanScheduleFreeTime();
        this.props.cleanFilmInSchedule();
        this.props.cleanTimeInSchedule();
        this.props.cleanFilmFormatInSchedule();
    };

    // Loads list of seances for selected date and hall
    // Will work only if attributes: hall ID and date are filled by user
    loadSchedule = () => {
        this.props.selectedHall && this.props.selectedDate && this.props.seances === null ? this.props.loadSeancesForDateAndHall(this.props.selectedDate, this.props.selectedHall) : [];
    };

    // Loads films according film ids which enable from seance list. Without seance list loading of films doens't make sense
    loadFilms = () => {
        if (!this.props.films) {
            this.props.getFilmsDate(this.props.selectedDate);
        }
        if (!this.props.filmFormats) {
            this.props.getFilmFormats();
        }
    };

    getFilmInfo = (filmId) => {
        const film = this.props.films ? this.props.films.filter(film => film.id === filmId)[0] : null;
        if (film == null) {
            return "";
        }

        return (
            <div className="d-flex flex-column">
                <div className="d-flex flex-row">
                    <div className="pb-2 pr-2">
                        <b>{"Название: "}</b>
                    </div>
                    <div>
                        {film.name}
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <div className="pb-2 pr-2">
                        <b>{"Продолжительность: "}</b>
                    </div>
                    <div>
                        {formatDuration(film.duration)}
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <div className="pb-2 pr-2">
                        <b>{"Жанр: "}</b>
                    </div>
                    <div className="d-flex flex-row">
                        {film.genres.map((g, index) => <div key={"genre-" + index}>{index === film.genres.length - 1 ? g.name + "" : g.name + ","}</div>)}
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <div className="pb-2 pr-2">
                        <b>{"Возрастные ограничения: "}</b>
                    </div>
                    <div>
                        {film.ageRestrictions[0].name}
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <div className="pb-2 pr-2">
                        <b>{"IMDB: "}</b>{film.imdb}
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <div className="pb-2 pr-2">
                        <b>{"Страна: "}</b>
                    </div>
                    <div className="d-flex flex-row">
                        {film.countries.map((r, index) => <div key={"country-" + index}>{index === film.countries.length - 1 ? r.name + "" : r.name + ","}</div>)}
                    </div>
                </div>
            </div>
        );
    };

    componentDidUpdate() {
    }

    showAddSeanceButtonSwitcher = () => {
        this.setState({
            ...this.state,
            showAddSeanceButton: !this.state.showAddSeanceButton
        })
    };

    deleteSeance = (seanceId) => {
        this.props.deleteSeance(seanceId);
    };

    callDeleteDialog = (seanceId) => {
        this.resetDeleteDialog();
        this.setState(
            {
                ...this.state,
                deleteSeance: seanceId
            }
        );
    };

    resetDeleteDialog = () => {
        this.setState(
            {
                ...this.state,
                deleteSeance: null
            }
        )
    };

    render() {
        const seanceCellWidth = {
            width: 350 + "px",
        };

        const seances = this.props.seances ? this.props.seances.map(seance => (
            <div style={seanceCellWidth} className="order-block" key={"seance-" + seance.id}>
                <div className="p-1">
                    <div className="d-flex flex-row">
                        <b>{"Время сеанса: " + getFormattedDate(seance.time)}</b>
                    </div>
                </div>
                <div className="p-1">{this.getFilmInfo(seance.filmId)}</div>
                <div className="text-center">
                    {
                        this.state.deleteSeance && this.state.deleteSeance === seance.id ? (
                            <div className="d-flex flex-column justify-content-center seance-border-delete-dialog pt-2">
                                <div className="d-flex justify-content-end mb-2 font-weight-bold">Вы уверены, что хотите удалить сеанс?</div>
                                <div className="d-flex flex-row justify-content-center">
                                    <div style={{width: 100 + "px"}} className="text-center btn btn-danger mr-2" onClick={() => this.deleteSeance(seance.id)}>Да</div>
                                    <div style={{width: 100 + "px"}} className="text-center btn btn-secondary cancel-delete-seance-button" onClick={() => this.resetDeleteDialog()}>Нет</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-right btn btn-danger" onClick={() => this.callDeleteDialog(seance.id)}>Удалить сеанс</div>
                        )
                    }
                </div>
            </div>
        )) : ("");

        const freeTimes = this.props.freeTimes ? console.log(this.props.freeTimes) : "";

        return (
            <div className="p-1">
                {freeTimes}
                {this.loadSchedule()}
                <div className="text-center p-3">
                    <h3>Составить расписание</h3>
                </div>
                <div className="d-flex flex-row justify-content-center">
                    <div className="">
                        <Input type="select"className="medium-input-field" onChange={this.selectDate} placeholder="Выберите день">
                            {
                                this.getDates()
                            }
                        </Input>
                    </div>
                    <div>
                        <Input type="select"className="medium-input-field" onChange={this.selectHall} placeholder="Выберите зал">
                            {
                                this.getHalls()
                            }
                        </Input>
                    </div>
                    <div>
                        {this.props.seances ? ( <Button className="btn-success add-seance-button" onClick={() => this.showAddSeanceButtonSwitcher()}>Добавить сеанс</Button>) : ("")}
                    </div>
                </div>
                {this.loadFilms()}
                {
                    this.state.showAddSeanceButton ? (
                        <AddSeance filmFormats={this.props.filmFormats} hallId={this.props.selectedHall} date={this.props.selectedDate} freeTimes={this.props.freeTimes} films={this.props.films}/>
                    ) : ("")
                }
                {
                    seances ? (
                        <div>
                            <div className="text-center">
                                <h3>Список сеансов</h3>
                            </div>
                            <div className="d-flex flex-row flex-wrap seance-wrapper">
                                {seances}
                            </div>
                        </div>
                    ) : ("")
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    halls: state.hall ? state.hall.halls : [],
    films: state.schedule ? state.schedule.films : [],
    filmFormats: state.schedule ? state.schedule.filmFormats : [],
    selectedDate: state.schedule ? state.schedule.scheduleDate : null,
    selectedHall: state.schedule ? state.schedule.scheduleHall : null,
    seances: state.schedule ? state.schedule.seances : null
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        loadHalls,
        loadSeancesForDateAndHall,
        cleanScheduleSeances,
        getFilmsDate,
        cleanScheduleFilms,
        getFilmFormats,
        cleanScheduleFilmFormats,
        getFreeTimes,
        cleanScheduleFreeTime,
        cleanFilmInSchedule,
        cleanTimeInSchedule,
        cleanFilmFormatInSchedule,
        selectHallInSchedule,
        cleanHallInSchedule,
        selectDateInSchedule,
        cleanDateInSchedule,
        deleteSeance
    },
    dispatch
);


export default connect(mapStateToProps, mapDispatchToProps) (OrderPayment);