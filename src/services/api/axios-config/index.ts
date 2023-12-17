import axios from "axios";
import { Environment } from "../../../shared/environment";

const Api = axios.create({
    baseURL: Environment.URL_BASE,
});

export {Api}