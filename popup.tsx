import { useState } from "react"
import { SketchPicker } from "react-color"

import { useStorage } from "@plasmohq/storage"

function IndexPopup() {
  const [data, setData] = useState("")
  const [appliedColor, setAppliedColor] = useStorage("appliedColor", "#4b9e59")
  const [bannedColor, setBannedColor] = useStorage("bannedColor", "#eb5f4d")
  const [bannedJobTitles, setBannedJobTitles] = useStorage(
    "bannedJobTitles",
    []
  )

  //had to use a string value here because booleans were not working
  //not sure if its a bug or a feature but it works
  const [hideBannedJobs, setHideBannedJobs] = useStorage(
    "hideBannedJobs",
    "false"
  )


  const [bannedTerm, setBannedTerm] = useState("")

  const [showBannedColorPicker, setShowBannedColorPicker] = useState(false)
  const [showAppliedColorPicker, setShowAppliedColorPicker] = useState(false)

  return (
    <div
      style={{
        width: "300px",
        padding: 16
      }}>
      <h1
        style={{
          fontSize: "16px",
          textAlign: "center"
        }}>
        builtinchicago job buddy
      </h1>

      <div>
       
          <div>
            <p style={{
              textAlign: "center",
            }}>Set color for jobs that contain banned terms</p>
            <div   onClick={() => setShowBannedColorPicker(true)} style={{
              padding: "4px",
              backgroundColor: "#d8d8d8",
            }}>

         
            <div
            
              style={{
                width: "100%",
                height: "16px",
                backgroundColor: bannedColor,
           
              }}/> 
                 </div>
              {/* //end of circle showing color */}

         
             {showBannedColorPicker ? (
              <div
                style={{
                  position: "absolute",
                  zIndex: "2"
                }}>
                <div
                  style={{
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px"
                  }}
                  onClick={() => setShowBannedColorPicker(false)}
                />
                <SketchPicker
                  color={bannedColor}
                  onChange={(color) => {
                    setBannedColor(color.hex)
                  }}
                />
              </div> //end of div containing color picker
             ) : null} 
            <p style={{
              textAlign: "center",
            }}>Set color for jobs that contain banned terms</p>

            <div    onClick={() => setShowAppliedColorPicker(true)} style={{
              padding: "4px",
              backgroundColor: "#d8d8d8",
            }}>
            <div
             
              style={{
                width: "100%",
                height: "16px",
                backgroundColor: appliedColor,
              
              }}/> 
              {/* //end of circle showing color */}
              </div>
         
             {showAppliedColorPicker ? (
              <div
                style={{
                  position: "absolute",
                  zIndex: "2"
                }}>
                <div
                  style={{
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px"
                  }}
                  onClick={() => setShowAppliedColorPicker(false)}
                />
                <SketchPicker
                  color={appliedColor}
                  onChange={(color) => {
                    setAppliedColor(color.hex)
                  }}
                />
              </div> //end of div containing color picker
             ) : null} 
        
       
          </div>
          {/* //end of divs containing the two colors */}
      

        <div>
          <label>Hide Banned Jobs</label>
          <input type="checkbox" checked={ hideBannedJobs==="true"? true : false} onChange={
             ()=>{
              if (hideBannedJobs === "false") {
                setHideBannedJobs("true")
              } else {
                setHideBannedJobs("false")
              }

            }
          } />
         

        </div>
        <div>
          <h3>Banned Terms List</h3>
          <ul
            style={{
              listStyle: "none"
            }}>
            {bannedJobTitles.map((title, index) => {
              return (
                <div key={index}>
                  {" "}
                  <li>
                    {title}{" "}
                    <button
                      onClick={() => {
                        setBannedJobTitles(
                          bannedJobTitles.filter((t, i) => i !== index)
                        )
                      }}
                      style={{
                        backgroundColor: "red",
                        border: "none",
                        padding: "6px",
                        display: "inline-block"
                      }}>
                      -
                    </button>
                  </li>{" "}
                </div>
              )
            })}
            <form
              onSubmit={(e) => {
                const tempBannedTerm = bannedTerm
                e.preventDefault()
                setBannedJobTitles([
                  ...bannedJobTitles,
                  tempBannedTerm.toLowerCase()
                ])
                setBannedTerm("")
              }}>
              <input
                type="text"
                placeholder="Add a banned term"
                value={bannedTerm}
                onChange={(e) => {
                  setBannedTerm(e.target.value)
                }}
              />
              <button>Add</button>
            </form>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
