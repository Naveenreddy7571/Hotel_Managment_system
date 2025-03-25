import { useState } from "react";
import { Input } from "../Dashboards/AdminDashboard/Input";
import { Button } from "../Dashboards/Common/PrimaryButton";
import { Loader } from "../Dashboards/Common/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterHostel() {
  const registerHostel = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let hostel = {
        name: name,
        location: location,
        rooms: rooms,
        capacity: capacity,
        vacant: vacant
      };
      const res = await fetch("http://localhost:3000/api/admin/register-hostel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hostel),
      })
      const data = await res.json();

      if (data.success) {
        toast.success(
          'Hostel ' + data.hostel.name + ' Registered Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        setName("");
        setLocation("");
        setRooms("");
        setCapacity("");
        setVacant("");
        setLoading(false);
      } else {
        data.errors.forEach((err) => {
          toast.error(
            err.msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          })
        })
        setLoading(false);
      }
    } catch (err) {
      toast.error(
        err.message || 'Server Error', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      }
      )
      setLoading(false);
    }
  };

  
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vacant, setVacant] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <h1 className="text-white font-bold text-5xl mt-10 mb-5">
        Register Hostel
      </h1>
      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-lg shadow-xl mb-10 overflow-auto">
        <form method="post" onSubmit={registerHostel} className="flex flex-col gap-3">
          <div className="flex gap-5 flex-wrap justify-center md:w-full sw-[100vw]">
            <Input
              field={{
                name: "name",
                placeholder: "Hostel Name",
                type: "text",
                req: true,
                value: name,
                onChange: (e) => setName(e.target.value),
              }}
            />
            <Input
              field={{
                name: "location",
                placeholder: "Hostel Location",
                type: "text",
                req: true,
                value: location,
                onChange: (e) => setLocation(e.target.value),
              }}
            />
          </div>
          <div className="flex gap-5 w-full flex-wrap justify-center">
            <Input
              field={{
                name: "rooms",
                placeholder: "Total Rooms",
                type: "number",
                req: true,
                value: rooms,
                onChange: (e) => setRooms(e.target.value),
              }}
            />
            <Input
              field={{
                name: "capacity",
                placeholder: "Total Capacity",
                type: "number",
                req: true,
                value: capacity,
                onChange: (e) => setCapacity(e.target.value),
              }}
            />
            <Input
              field={{
                name: "vacant",
                placeholder: "Vacant Rooms",
                type: "number",
                req: true,
                value: vacant,
                onChange: (e) => setVacant(e.target.value),
              }}
            />
          </div>
          <div className="mt-5">
            <Button>
              {loading ? (
                <>
                  <Loader /> Registering...
                </>
              ) : (
                <span>Register Hostel</span>
              )}
            </Button>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterHostel;