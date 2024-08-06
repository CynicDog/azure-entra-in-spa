## Deployment Architecture 
```mermaid
C4Deployment
    title  
    
    Deployment_Node(github, "GitHub SPA host") {
        Container(React, "React", "Single Page Application", "")
    }

    Deployment_Node(teams, "Teams") {
        Container(Teams, "Teams", "", "")
    }

    Deployment_Node(azure, "Azure / Entra ID") {
        Deployment_Node(organizationalResources, "Publishing Organization") {
            ContainerDb(Organizational_Resources, "Organizational Resources", "")
            
            Deployment_Node(publishingOrganization, "Local representation of registration") {
                Container(Service_Principal, "Service Principal", "", "")
                Container(Enterprise_Application, "Enterprise Application", "", "")        
            }
        }

        Deployment_Node(appRegistrations, "App Registrations") {
                    Container(helloworld_app, "helloworld-app", "Graph API permissions", "User.ReadWrite, Presence.ReadWrite")
        }
    }
    
    Rel(helloworld_app, Enterprise_Application, "Exposes as")
    Rel(Teams, Service_Principal, "Delegates to")
    Rel(React, Teams, "Provides endpoint")
    BiRel(Service_Principal, Organizational_Resources, "Accesses")
    BiRel(Teams, Organizational_Resources, "On behalf of user")
    BiRel(Enterprise_Application, Service_Principal, "")

    UpdateElementStyle(azure, $borderColor="gray")
    UpdateElementStyle(github, $borderColor="gray")
    UpdateElementStyle(teams, $borderColor="gray")
    UpdateElementStyle(organizationalResources, $borderColor="gray")
    UpdateElementStyle(appRegistrations, $borderColor="gray")
    UpdateElementStyle(publishingOrganization, $borderColor="gray")
    
    UpdateRelStyle(helloworld_app, Enterprise_Application, $textColor="white", $lineColor="gray", ,$offsetX="5")
    UpdateRelStyle(Teams, Service_Principal, $textColor="white", $lineColor="gray", $offsetX="-40")
    UpdateRelStyle(React, Teams, $textColor="white", $lineColor="gray", $offsetY="-15", $offsetX="-40")
    UpdateRelStyle(Service_Principal, Organizational_Resources, $textColor="white", $lineColor="gray", $offsetY="-15", $offsetX="-40")
    UpdateRelStyle(Teams, Organizational_Resources, $textColor="white", $lineColor="gray", $offsetY="-15", $offsetX="-40")
    UpdateRelStyle(Enterprise_Application, Service_Principal, $textColor="white", $lineColor="gray")
```
<details>
  <summary>First look in to the app (on Teams with SSO) 👀</summary>
  <img src="https://github.com/user-attachments/assets/0a4db79b-b849-413f-a625-289d5a947d15"></img>
</details>

<details>
  <summary>First look in to the app (on web browser with login popup) 👀</summary>
  <img src="https://github.com/user-attachments/assets/3542b9ef-8520-4b82-829a-c1693895298e"></img>
</details>


