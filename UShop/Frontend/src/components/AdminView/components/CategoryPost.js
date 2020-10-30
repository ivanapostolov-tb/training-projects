import React from 'react';
import './AdminForms.css';

class CategoryPost extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async request() {
        const url = this.props.baseUrl + 'api/category';

        const formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('name', this.name);
        formData.append('img', this.image);

        const parameters = {
            method: 'post',
            body: formData
        }

        try {
            const response = await fetch(url, parameters);

            if (response.status === 200) {
                return (await response.json());
            } else {
                throw new Error(`Status code ${response.status}`);
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.props.callback();

        try {
            await this.request();

            alert('success');
        } catch (e) {
            console.log(e.message);

            alert('error');
        }
    }

    render() {
        return (
            <form className="admin__form" onSubmit={this.handleSubmit}>
                <ul>
                    <li>
                        <div className="admin__formTitle">Form Title</div>
                    </li>
                    <li>
                        <label>Category Name</label>
                        <input type="text" value={this.name} onChange={e => this.name = e.target.value} />
                    </li>
                    <li>
                        <label>Category Image</label>
                        <input type="file" value={this.image} accept="image/*" onChange={e => this.image = e.target.files[0]} />
                    </li>
                    <li>
                        <button type="submit" className="admin__formButton">Submit</button>
                    </li>
                </ul>
            </form>
        );
    }
}

export default CategoryPost;
